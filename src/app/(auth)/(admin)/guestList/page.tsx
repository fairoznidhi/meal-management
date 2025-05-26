'use client'


import React, { useState } from "react";
import { useGuests } from "@/services/EmployeeList/queries"; 
import { useToggleEmployeeStatus} from "@/services/mutations"; 
import notificationToast from "@/components/notificationToast";
import GuestRow from "@/features/guestList/guestRow"; 
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import Modal from "@/components/modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useQueryClient } from '@tanstack/react-query';




const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

type Dept = {
  dept_id: number;
  dept_name: string;
  weekends: string[];
};

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

const GuestsTablePage = () => {

  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useGuests();
  
 
    const [showDeptModal, setShowDeptModal] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [departments, setDepartments] = useState<Dept[]>([]);
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
    

      if (isLoading) return <div><span className="loading loading-dots loading-lg"></span></div>;
      if (isError) return <div>Something went wrong while fetching guests.</div>;
      
      
        
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


      const addEmployeeAsGuest = async () => {
        try {
         
          const formData = new FormData();
          formData.append("name", newEmployee.name);
          formData.append("email", newEmployee.email);
          formData.append("password", newEmployee.password);
          formData.append("dept_id", newEmployee.dept_id);
          formData.append("phone_number", newEmployee.phone_number);
          formData.append("remarks", newEmployee.remarks);
      
          formData.append("is_active", "true"); 
          formData.append("is_permanent", "false"); 
          if (newEmployee.photo) {
            formData.append("photo", newEmployee.photo, newEmployee.photo.name);
          }
          formData.append("preference_food", JSON.stringify([]));
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
      
          await createMealPlan();
          setShowAddModal(false);
          resetForm();
          queryClient.invalidateQueries({ queryKey: ['guests'] });
          notificationToast("Guest Employee Added Successfully", "success");
        } catch (err: any) {
          console.error("Error adding guest employee:", err);
          notificationToast("Failed to Add Guest Employee", "error");
        }
      };


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


      const handleEmailChange = (e:any) => {
        const value = e.target.value;
        setNewEmployee({ ...newEmployee, email: value });
        const emailRegex = /^[^\s@]+@yopmail\.com$/;
        if (!emailRegex.test(value)) {
          setEmailError("Please enter a valid email like emp@gmail.com");
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
      
      
      
      const handleAddEmployeeAsGuest = () => {
        if (validateFields()) {
          addEmployeeAsGuest();
        }
      };
      
  

  return (
    <>
    <div className="p-4">
      <div className="flex justify-between">
      <h2 className="text-xl font-bold">Guest List</h2>
      <button onClick={handleAddEmployeeClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 me-3">Add New Guest</button>
      </div>
      <table className="min-w-full border border-gray-300 mt-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-center">Name</th>
            <th className="border px-4 py-2 text-center">Active Status</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
            {data && data.length > 0 ? (
             data.map((guest) => (
             <GuestRow key={guest.employee_id} guest={guest} />
            ))
         ) : (
         <tr>
         <td colSpan={2} className="border px-4 py-4 text-center text-gray-500">
             Guest list is empty.
         </td>
         </tr>
          )}
         </tbody>

      </table>
    </div>


    <Modal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              resetForm();
            }}
            title="Add New Guest"
            footer={
              <>
               
                <button
              onClick={handleAddEmployeeAsGuest}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 me-3"
            >
              Add Guest
            </button>
      
          
          
               
              </>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              
    
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
                
              </div>
              <div>
                <label className="block mb-2 relative">
                  <span>Password:</span>
                  <span className="absolute top-0 left-18 text-red-500">*</span>
                </label>
               
    
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
    
            </div>
          </Modal>

    </>
   
  );
};

export default GuestsTablePage;

  