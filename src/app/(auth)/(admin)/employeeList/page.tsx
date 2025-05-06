"use client";

import React, { useEffect, useState } from "react";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path
import Search from "@/components/Search";
import Modal from "@/components/modal";
import { headers } from "next/headers";
import DepartmentModal from "@/features/employeeList/deptModal";
import notificationToast from "@/components/notificationToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

type Employee = {
  employee_id: string;
  name: string;
  email: string;
  password: string;
  dept_id: string;
  phone_number: string;
  remarks: string;
  preference_food:number[];
  is_permanent:boolean;
  is_active:boolean;
  designation:string;
  roll:string;
};

type TotalMeal = {
  name: string;
  total_count: number;
};

type EmployeeWithMealInfo = {
  employee_id: string;
  name: string;
  email: string;
  phone_number: string;
  remarks: string;
  dept_name: string;
  lunch: number;
  snacks: number;
  penalties: number | string;
};

type MealsResponse = {
  employee_id: string;
  name: string;
  lunch: number;
  snacks: number;
};

type Dept = {
  dept_id: number;
  dept_name: string;
  weekends: string[];
};

const getCurrentMonthDetails = () => {
  const now = new Date();
  const firstDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );
  const lastDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
  );
  const daysInMonth = lastDate.getUTCDate();

  const dates = [];
  for (let i = 0; i < daysInMonth; i++) {
    const utcDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), i + 1)
    );
    dates.push(utcDate.toISOString().split("T")[0]); // Returns YYYY-MM-DD format in UTC
  }

  return {
    now,
    firstDate: firstDate.toISOString().split("T")[0], // First day in UTC
    //lastDate: lastDate.toISOString().split("T")[0],   // Last day in UTC
    daysInMonth,
    //dates, // Array of all dates in the month
  };
};

const EmployeeComponent: React.FC = () => {
  const now = new Date();
  const [responseData, setResponseData] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [showDeptModal, setShowDeptModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Row | null>(null);
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState<Row | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(now.getUTCMonth()); // Default: Current month
  const [selectedYear, setSelectedYear] = useState(now.getUTCFullYear()); // Default: Current year
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(true);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    email: string;
    password: string;
    dept_id: string;
    phone_number: string;
    remarks: string;
    photo: File | null;
    preference_food:number[];
    designation:string;
    roll:string;
  }>({
    name: "",
    email: "",
    password: "",
    dept_id: "",
    phone_number: "",
    remarks: "",
    photo: null,
   preference_food:[],
   designation:"",
   roll:"",
  });
  const [searchTerm, setSearchTerm] = useState("");

  //const { now, firstDate, daysInMonth } = getCurrentMonthDetails();

  const getMonthDetails = (year: number, month: number) => {
    const firstDate = new Date(Date.UTC(year, month, 1));
    const lastDate = new Date(Date.UTC(year, month + 1, 0));
    const daysInMonth = lastDate.getUTCDate();

    return {
      firstDate: firstDate.toISOString().split("T")[0], // YYYY-MM-DD format
      lastDate: lastDate.toISOString().split("T")[0], // YYYY-MM-DD format
      daysInMonth,
    };
  };

  const { firstDate, lastDate, daysInMonth } = getMonthDetails(
    selectedYear,
    selectedMonth
  );

  const resetForm = () => {
    setNewEmployee({
      name: "",
      email: "",
      password: "",
      dept_id: "",
      phone_number: "",
      remarks: "",
      photo: null,
      preference_food:[],
      designation:"",
      roll:""
    });
  };

  const fetchDept = async () => {
    try {
      const dept = await request({
        url: "/dept",
        method: "GET",
        useAuth: true,
      });
      return dept as Dept[];
    } catch (err: any) {
      console.error("Error fetching depts:", err);
      return [];
    }
  };

  const fetchEmployees = async () => {
    try {
      const employees = await request({
        url: "/employee",
        method: "GET",
        useAuth: true,
      });
      return employees as any[];
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      //setError(err.response?.data?.message || "Failed to fetch employees.");
      notificationToast("Error Fetching Employee List", "error");
      return [];
    }
  };

  // Send PATCH request for employee penalties
  const sendPatchRequestForPenalty = async (employee: any) => {
    try {
      const response = await request({
        url: "/meal_activity/total-penalty",
        method: "PATCH",
        data: {
          date: firstDate,
          employee_id: employee.employee_id,
          days: daysInMonth,
        },
        useAuth: true,
      });
      return {
        employee_id: employee.employee_id,
        name: employee.name,
        email: employee.email,
        dept_name: employee.dept_name,
        phone_number: employee.phone_number,
        remarks: employee.remarks,
        penalties: response,
      };
    } catch (err: any) {
      console.error(
        `Error during PATCH request for penalty of employee ${employee.id}:`,
        err
      );
      return {
        employee_id: employee.employee_id,
        name: employee.name,
        remarks: employee.remarks,
        penalties: "Error occurred",
      };
    }
  };

  // Send PATCH request for lunch and snacks
  const sendPatchRequestForMeals = async (employee: any) => {
    try {
      const response = (await request({
        url: "/meal_activity/meal-summary",
        method: "PATCH",
        data: {
          start_date: firstDate,
          days: daysInMonth,
        },
        useAuth: true,
      })) as MealsResponse[];

      // Find the specific meal data for the current employee
      const employeeMeal = response.find(
        (meal) => meal.employee_id === employee.employee_id
      );

      return {
        employee_id: employee.employee_id,
        name: employee.name,
        lunch: employeeMeal?.lunch || 0, // Default to 0 if not found
        snacks: employeeMeal?.snacks || 0, // Default to 0 if not found
      };
    } catch (err: any) {
      console.error(
        `Error during PATCH request for meals of employee ${employee.id}:`,
        err
      );
      return {
        employee_id: employee.employee_id,
        name: employee.name,
        lunch: 0,
        snacks: 0,
      };
    }
  };

  const fetchAndPatchEmployees = async () => {
    setError(null);
    setResponseData([]);
    setLoading(true);
    //notificationToast("Fetching Employee List","info");
    const employees = await fetchEmployees();
    if (employees.length === 0) {
      setError("No employees found.");
      return;
    }

    const results = await Promise.all(
      employees.map(async (employee: any) => {
        const penalties = await sendPatchRequestForPenalty(employee);
        const meals = await sendPatchRequestForMeals(employee);
        return {
          ...penalties,
          ...meals,
        };
      })
    );

    setResponseData(results);
    setLoading(false);
  };

  const deleteEmployee = async (employeeId: number) => {
    try {
      await request({
        url: `/employee`,
        method: "DELETE",
        params: {
          employee_id: employeeId,
          date: now,
        },
        useAuth: true,
      });
      setResponseData((prevData) =>
        prevData.filter((row) => row.employee_id !== employeeId)
      );
      notificationToast("Employee Deleted Successfully", "success");
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      notificationToast("Failed to Delete Employee", "error");
      //setError(err.response?.data?.alert || "Failed to delete employee.");
    }
  };
  const createMealPlan = async () => {
    try {
      await request({
        url: "/meal_activity",
        method: "POST",
        useAuth: true,
      });
    } catch (err: any) {
      console.error("Error creating meal plan:", err);
    }
  };
  const addEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newEmployee.name);
      formData.append("email", newEmployee.email);
      formData.append("password", newEmployee.password);
      formData.append("dept_id", newEmployee.dept_id);
      formData.append("phone_number", newEmployee.phone_number);
      formData.append("remarks", newEmployee.remarks);
      if (newEmployee.photo) {
        formData.append("photo", newEmployee.photo, newEmployee.photo.name);
      }
      formData.append("preference_food", JSON.stringify([]));

       // Add the new fields here
    formData.append("is_active", "true"); // Convert boolean to string as FormData always works with strings
    formData.append("is_permanent", "true");
    formData.append("designation",newEmployee.designation);
    formData.append("roll",newEmployee.roll);
      notificationToast("Processing", "info");
      const response = (await request({
        url: "/employee",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        useAuth: true,
      })) as Employee;

      setResponseData((prevData) => [
        ...prevData,
        {
          name: newEmployee.name,
          email: newEmployee.email,
          dept_id: newEmployee.dept_id,
          phone_number: newEmployee.phone_number,
          remarks: newEmployee.remarks,
          penalties: "N/A",
          lunch: 0,
          snacks: 0,
          preference_food:[],
        },
      ]);
      await createMealPlan();
      setShowAddModal(false);
      resetForm();
      notificationToast("Employee Added Successfully", "success");
    } catch (err: any) {
      console.error("Error adding employee:", err);
      //alert("Failed to add Employee");
      //setError(err.response?.data?.message);
      notificationToast("Failed to Add Employee", "error");
    }
  };

  

  const updateEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append("employee_id", selectedEmployee?.employee_id);
      formData.append("name", updatedEmployee?.name);
      formData.append("email", updatedEmployee?.email);
      formData.append("dept_id", updatedEmployee?.dept_id);
      formData.append("phone_number", updatedEmployee?.phone_number);
      formData.append("remarks", updatedEmployee?.remarks);
      formData.append("preference_food", selectedEmployee?.preference_food); // Send empty array
      formData.append("is_active","true");
      formData.append("is_permanent","true");
      await request({
        url: `/employee`,
        method: "PATCH",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        useAuth: true,
      });

      setResponseData((prevData) =>
        prevData.map((emp) =>
          emp.employee_id === selectedEmployee?.employee_id
            ? { ...emp, ...updatedEmployee }
            : emp
        )
      );
      setShowDeleteModal(false);
      setIsEditing(false);
      //alert("Employee Updated Successfully");
      notificationToast("Employee Updated Successfully", "success");
      await fetchAndPatchEmployees();
    } catch (err: any) {
      console.error("Error updating employee:", err);
      //alert("Failed to update employee,please select a department");
      notificationToast(
        "Failed to Update Employee, please select a department",
        "warning"
      );
    }
  };

  {
    /*useEffect(() => {
        fetchAndPatchEmployees();
    }, []);*/
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchAndPatchEmployees(); // Call your existing function
      const deptList = await fetchDept(); // Call fetchDept
      setDepartments(deptList); // Store fetched departments in state
    };

    fetchData(); // Invoke the async function inside useEffect
  }, [selectedYear, selectedMonth]);

  const handleAddEmployeeClick = async () => {
    try {
      // Call the additional API
      const deptList = await fetchDept();
      setDepartments(deptList);
      // After the API call is successful, show the modal
      setShowAddModal(true);
    } catch (error) {
      console.error("Error calling additional API:", error);
      // Handle error appropriately, maybe show an alert
    }
  };

  const filteredData = responseData.filter(
    (row: Row) =>
      (row.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (row.remarks?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  const columns: Column[] = [
    {
      key: "name",
      label: "Employee Name",
      render: (value, row) => (
        <span
          className="cursor-pointer"
          onClick={() => {
            setSelectedEmployee(row);
            setShowDeleteModal(true);
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "remarks",
      label: "Remarks",
      render: (value) => value || "N/A",
    },
    {
      key: "penalties",
      label: "Penalties",
    },
    {
      key: "lunch",
      label: "Lunch",
    },
    {
      key: "snacks",
      label: "Snacks",
    },
    /*{
      key: "preference_food",
      label: "Food Preferences",
      render: (value) => (value && value.length > 0 ? value.join(", ") : "None"),
    },*/
  ];

  const handleSelectChange = (e: any) => {
    const selectedValue = e.target.value;
    if (selectedValue === "add_new") {
      setShowDeptModal(true);
      setShowAddModal(false);
      setSelectedDept(""); // Reset selection
    } else {
      setSelectedDept(selectedValue);
    }
  };

  const handleEmailChange = (e:any) => {
    const value = e.target.value;
    setNewEmployee({ ...newEmployee, email: value });

    // Validate email format: any characters before @yopmail.com
    const emailRegex = /^[^\s@]+@yopmail\.com$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email like em@gmail.com");
    } else {
      setEmailError("");
    }
  };
  
  const handlePhoneChange = (e:any) => {
    const value = e.target.value;
    setNewEmployee({ ...newEmployee, phone_number: value });
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Phone number must be 11 digits");
    } else {
      setPhoneError("");
    }
  };


  const validateFields = () => {
    let valid = true;
  
    const emailRegex = /^[^\s@]+@yopmail\.com$/;
    if (!emailRegex.test(newEmployee.email)) {
      setEmailError("Please enter a valid email like emp@gmail.com");
      valid = false;
    } else {
      setEmailError("");
    }
  
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(newEmployee.phone_number)) {
      setPhoneError("Phone number must be valid");
      valid = false;
    } else {
      setPhoneError("");
    }
  
    return valid;
  };
  
  
  
  const handleAddEmployee = () => {
    if (validateFields()) {
      addEmployee();
    }
  };
  




  return (
    <div className="p-4">
      <div className="bg-stone-50 p-2 mt-2 rounded-lg">
      <div className="flex justify-between mb-2 items-end">
        <div className="flex gap-1 items-center mx-2">
          Select Month: 
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-2 py-1 border rounded bg-[#f4f4f4]"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-2 py-1 border rounded bg-[#f4f4f4]"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = now.getFullYear() - 2 + i; // Show 2 years before and 2 years after
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-1">
        <button
          onClick={() => handleAddEmployeeClick()}
          className="bg-vivaBlue text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
          <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </div>

      <div className="mt-4">
        {responseData.length > 0 && (
          <Table
            columns={columns}
            data={filteredData.length > 0 ? filteredData : responseData}
          />
          
        )}
        {loading && <span className="loading loading-dots loading-lg"></span>}
        {error && (
          <div>
            <h3 className="text-red-500">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
      </div>

      {/* Delete & Update Modal */}
      {showDeleteModal && selectedEmployee && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setIsEditing(false); // Reset edit mode
          }}
          title={
            isEditing
              ? `Edit Employee: ${selectedEmployee.name}`
              : `${selectedEmployee.name}`
          }
          footer={
            <>
              {!isEditing ? (
                <>
                  {/* Cancel Button 
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded me-3"
                        >
                            Cancel
                        </button>*/}

                  {/* Update Button */}
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setUpdatedEmployee(selectedEmployee);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded me-3"
                  >
                    Update
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteEmployee(selectedEmployee.employee_id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {/* Cancel Edit Button */}
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setUpdatedEmployee(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-black rounded me-3"
                  >
                    Cancel
                  </button>

                  {/* Save Changes Button */}
                  <button
                    onClick={async () => {
                      setIsEditing(true);
                      setUpdatedEmployee({
                        name: selectedEmployee.name,
                        email: selectedEmployee.email,
                        dept_id: selectedEmployee.dept_id,
                        phone_number: selectedEmployee.phone_number,
                        remarks: selectedEmployee.remarks,
                      });
                      await updateEmployee();
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <strong>Name:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={updatedEmployee?.name || ""}
                  onChange={(e) =>
                    setUpdatedEmployee({
                      ...updatedEmployee,
                      name: e.target.value,
                    } as Row)
                  }
                  className="border px-4 py-2 w-full rounded"
                />
              ) : (
                selectedEmployee.name
              )}
            </div>

            <div>
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  value={updatedEmployee?.email || ""}
                  onChange={(e) =>
                    setUpdatedEmployee({
                      ...updatedEmployee,
                      email: e.target.value,
                    } as Row)
                  }
                  className="border px-4 py-2 w-full rounded"
                />
              ) : (
                selectedEmployee.email || "N/A"
              )}
            </div>

            <div>
              <strong>Phone Number:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={updatedEmployee?.phone_number || ""}
                  onChange={(e) =>
                    setUpdatedEmployee({
                      ...updatedEmployee,
                      phone_number: e.target.value,
                    } as Row)
                  }
                  className="border px-4 py-2 w-full rounded"
                />
              ) : (
                selectedEmployee.phone_number || "N/A"
              )}
            </div>

            <div>
              <strong>Department:</strong>
              {isEditing ? (
                <select
                  value={updatedEmployee?.dept_id || ""}
                  onChange={(e) =>
                    setUpdatedEmployee({
                      ...updatedEmployee,
                      dept_id: e.target.value,
                    } as Row)
                  }
                  className="border px-4 py-2 w-full rounded"
                >
                  <option value="" disabled>
                    Select a department
                  </option>{" "}
                  {/* Empty option for the default state */}
                  {departments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              ) : (
                selectedEmployee.dept_name || "N/A"
              )}
            </div>

            <div>
              <strong>Remarks:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={updatedEmployee?.remarks || ""}
                  onChange={(e) =>
                    setUpdatedEmployee({
                      ...updatedEmployee,
                      remarks: e.target.value,
                    } as Row)
                  }
                  className="border px-4 py-2 w-full rounded"
                />
              ) : (
                selectedEmployee.remarks || "N/A"
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Employee"
        footer={
          <>
            {/*<button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>*/}
            <button
              onClick={handleAddEmployee}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 me-3"
            >
              Add Employee
            </button>
      
      {/* Add the "Add as Guest" button */}
  
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {/*<div>
            <label className="block mb-2 relative">Name:</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            />
          </div>*/}

          <div>
            <label className="block mb-2 relative">
              <span>Name:</span>
              <span className="absolute top-0 left-12 text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              className="border px-4 py-2 w-full rounded"
            />
          </div>

          <div>
                <label className="block mb-2 relative">
                  <span>Email:</span>
                  <span className="absolute top-0 left-12 text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="ex: emp@gmail.com"
                  value={newEmployee.email}
                  onChange={//(e) =>
                    //setNewEmployee({ ...newEmployee, email: e.target.value })
                    handleEmailChange
                  }
                  className="border px-4 py-2 w-full rounded"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
          <div>
            <label className="block mb-2 relative">
              <span>Password:</span>
              <span className="absolute top-0 left-18 text-red-500">*</span>
            </label>
            {/*<input
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })
              } 
              className="border px-4 py-2 w-full rounded"
            />*/}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text/password
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="border px-4 py-2 w-full rounded" // Extra right padding for icon
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle state
                className="absolute inset-y-0 right-8 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/*<div>
            <label className="block mb-2 relative">
              <span>Dept. :</span>
              <span className="absolute top-0 right-72 text-red-500">*</span>
              </label>
            

<select
      value={newEmployee.dept_id}
      
     onChange={(e) => {
      if (e.target.value === "add new") {
        setShowDeptModal(true);
        setShowAddModal(false);
        setNewEmployee({ ...newEmployee, dept_id: "" }); // Reset selection
      } else {
        setNewEmployee({ ...newEmployee, dept_id: e.target.value });
      }
    }}
      className="border px-4 py-2 w-full rounded bg-gray-100"
    >
      <option value="" disabled>Select Department</option>
      {departments.map((dept) => (
        <option key={dept.dept_id} value={dept.dept_id}>
          {dept.dept_name}
        </option>
      ))}
      <option value="add new">+</option>
    </select>

          </div>*/}

          <div>
            <label className="block mb-2 relative">
              <span>Dept. :</span>
              <span className="absolute top-0 left-12 text-red-500">*</span>
            </label>

            <select
              value={newEmployee.dept_id}
              onChange={(e) => {
                if (e.target.value === "add new") {
                  setShowDeptModal(true);
                  setShowAddModal(false);
                  setNewEmployee({ ...newEmployee, dept_id: "" }); // Reset selection
                } else {
                  setNewEmployee({ ...newEmployee, dept_id: e.target.value });
                }
              }}
              className={`border px-4 py-2 w-full rounded bg-gray-100 ${
                newEmployee.dept_id ? "text-black" : "text-gray-400"
              }`}
            >
              <option value="" disabled className="text-gray-400">
                Select Department
              </option>
              {departments.map((dept) => (
                <option
                  key={dept.dept_id}
                  value={dept.dept_id}
                  className="text-black"
                >
                  {dept.dept_name}
                </option>
              ))}
              <option value="add new" className="text-black">
                +
              </option>
            </select>
          </div>

          <div>
                <label className="block mb-2 relative">
                  <span>Phone No.:</span>
                  <span className="absolute top-0 left-18 text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ex: 01xxxxxxxxx"
                  value={newEmployee.phone_number}
                  onChange={//(e) =>
                    //setNewEmployee({ ...newEmployee, phone_number: e.target.value })
                    handlePhoneChange
                  }
                  className="border px-4 py-2 w-full rounded"
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>
          
          <div>
            <label className="block mb-2 relative">
              <span>Designation:</span>
              <span className="absolute top-0 left-18 text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newEmployee.designation}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, designation: e.target.value })
              }
              className="border px-4 py-2 w-full rounded"
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          <div>
            <label className="block mb-2 relative">
              <span>Employee Id:</span>
              <span className="absolute top-0 left-18 text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newEmployee.roll}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, roll: e.target.value })
              }
              className="border px-4 py-2 w-full rounded"
            />
          </div>




          {/*  <div>
            <label className="block mb-2">Photo:</label>
            <input
              type="file"
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, photo: e.target.files?.[0] || null })
              }
              className="border px-4 py-2 w-full rounded"
            />
          </div>*/}
        </div>
      </Modal>

      {/*Dept add Modal */}
      <DepartmentModal
        showDeptModal={showDeptModal}
        setShowDeptModal={setShowDeptModal}
        resetForm={resetForm}
      />
    </div>
  );
};

export default EmployeeComponent;