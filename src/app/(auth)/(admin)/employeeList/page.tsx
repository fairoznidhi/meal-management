"use client"

import React, { useEffect, useState } from "react";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path
import Search from "@/components/Search";
import Modal from "@/components/modal";
import { headers } from "next/headers";

const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

// Helper function to get the first date and number of days in the current month
const getCurrentMonthDetails = () => {
  const now = new Date();
  const firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = lastDate.getDate();

  return {
    firstDate: firstDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    daysInMonth,
  };
};

const EmployeeComponent: React.FC = () => {
  const [responseData, setResponseData] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Row | null>(null);
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    email: string;
    password: string;
    dept_id: string;
    phone_number: string;
    remarks: string;
    photo: File | null;
  }>({
    name: "",
    email: "",
    password: "",
    dept_id: "",
    phone_number: "",
    remarks: "",
    photo: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to reset the form
  const resetForm = () => {
    setNewEmployee({
      name: "",
      email: "",
      password: "",
      dept_id: "",
      phone_number: "",
      remarks: "",
      photo: null,
    });
  };

  // Fetch employee details
  const fetchEmployees = async () => {
    try {
      const employees = await request({
        url: "/employee",
        method: "GET",
        useAuth: true,
      });
      return employees;
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError(err.response?.data?.message || "Failed to fetch employees.");
      return [];
    }
  };

  // Send PATCH request for a single employee
  const sendPatchRequest = async (employee: any) => {
    const { firstDate, daysInMonth } = getCurrentMonthDetails();

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
        email:employee.email,
        dept_id:employee.dept_id,
        phone_number:employee.phone_number,
        remarks: employee.remarks,
        penalties: response,
      };
    } catch (err: any) {
      console.error(`Error during PATCH request for employee ${employee.id}:`, err);
      return {
        employee_id: employee.employee_id,
        name: employee.name,
        remarks: employee.remarks,
        penalties: "Error occurred",
      };
    }
  };

  // Fetch and patch employees
  const fetchAndPatchEmployees = async () => {
    setError(null);
    setResponseData([]);

    const employees = await fetchEmployees();
    if (employees.length === 0) {
      setError("No employees found.");
      return;
    }

    const results = await Promise.all(
      employees.map((employee: any) => sendPatchRequest(employee))
    );

    setResponseData(results);
  };

  // Delete employee
  const deleteEmployee = async (employeeId: number) => {
    try {
      await request({
        url: `/employee`,
        method: "DELETE",
        params: {
          employee_id: employeeId,
        },
        useAuth: true,
      });
      setResponseData((prevData) => prevData.filter((row) => row.employee_id !== employeeId));
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      setError(err.response?.data?.alert || "Failed to delete employee.");
    }
  };

  // Add employee
  const addEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newEmployee.name);
      formData.append("email", newEmployee.email);
      formData.append("password", newEmployee.password);
      formData.append("dept_id", newEmployee.dept_id);
      formData.append("phone_number", newEmployee.phone_number);
      //formData.append("remarks", newEmployee.remarks);
      //if (newEmployee.photo) {
        //formData.append("photo", newEmployee.photo,newEmployee.photo.name); // Append the photo
      //}

      const response = await request({
        url: "/employee",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        useAuth: true,
      });
     // setResponseData((prevData) => [...prevData, response]);
     setResponseData((prevData) => [
      ...prevData,
      {
        employee_id: response.employee_id, // Ensure this matches the response format
        name: newEmployee.name,
        email: newEmployee.email,
        dept_id: newEmployee.dept_id,
        phone_number: newEmployee.phone_number,
        remarks: newEmployee.remarks || "", // Default to empty string if no remarks
        penalties: 0, // Initialize penalties to 0 or as per your requirement
      },
    ]);
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Error adding employee:", err);
      alert("Failed To add Employee");
      setError(err.response?.data?.message);
    }
  };

  // Fetch and patch employees on component mount
  useEffect(() => {
    fetchAndPatchEmployees();
  }, []);

  const filteredData = responseData.filter((row: Row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define columns for the table
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
    },
    {
      key: "penalties",
      label: "Penalties",
    },
  ];

  return (
    <div className="p-4">
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      <div className="mt-4">
        {responseData.length > 0 && <Table columns={columns} data={filteredData} />}
        {error && (
          <div>
            <h3 className="text-red-500">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Delete Modal 
      {showDeleteModal && selectedEmployee && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={`Delete ${selectedEmployee.name}`}
          footer={
            <>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteEmployee(selectedEmployee.employee_id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure you want to delete this employee?</p>
        </Modal>
      )}*/}


      {/* Delete Modal */}
{showDeleteModal && selectedEmployee && (
  <Modal
    isOpen={showDeleteModal}
    onClose={() => setShowDeleteModal(false)}
    title={`Delete Employee: ${selectedEmployee.name}`}
    footer={
      <>
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteEmployee(selectedEmployee.employee_id)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </>
    }
  >
    <div className="space-y-4">
      <div>
        <strong>Name:</strong> {selectedEmployee.name}
      </div>
      <div>
        <strong>Email:</strong> {selectedEmployee.email || "N/A"}
      </div>
      <div>
        <strong>Phone Number:</strong> {selectedEmployee.phone_number || "N/A"}
      </div>
      <div>
        <strong>Department ID:</strong> {selectedEmployee.dept_id || "N/A"}
      </div>
      <div>
        <strong>Remarks:</strong> {selectedEmployee.remarks || "N/A"}
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
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={addEmployee}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Dept ID:</label>
            <input
              type="text"
              value={newEmployee.dept_id}
              onChange={(e) => setNewEmployee({ ...newEmployee, dept_id: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            ></input>
          </div>
          
          <div>
            <label className="block mb-2">Phone No.:</label>
            <input
              type="text"
              value={newEmployee.phone_number}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone_number: e.target.value })}
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
    </div>
  );
};

export default EmployeeComponent;