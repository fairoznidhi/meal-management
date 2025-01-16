'use client';

import React, { useEffect, useState } from "react";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path

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

const BatchPatchRequestComponent: React.FC = () => {
  const [responseData, setResponseData] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Row | null>(null);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", password: "", dept_id:"", phone: "", remarks: "" });

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
      return { name: employee.name, remarks: employee.remarks, penalties: response };
    } catch (err: any) {
      console.error(`Error during PATCH request for employee ${employee.id}:`, err);
      return { name: employee.name, remarks: employee.remarks, penalties: "Error occurred" };
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
        url: `/employee/${employeeId}`,
        method: "DELETE",
        useAuth: true,
      });
      setResponseData((prevData) => prevData.filter((row) => row.employee_id !== employeeId));
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      setError(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  const addEmployee = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("name", newEmployee.name);
      formData.append("email", newEmployee.email);
      formData.append("password", newEmployee.password);
      formData.append("dept_id", newEmployee.dept_id);
      formData.append("phone",newEmployee.phone);
      formData.append("remarks", newEmployee.remarks);
  
      // If additional fields are needed, append them here
      // formData.append("fieldName", fieldValue);
  
      // Send the POST request
      const response = await request({
        url: "/employee", // Replace with your API endpoint
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Optional, FormData sets this automatically
        },
        useAuth: true, // Include authentication if required
      });
  
      // Update the UI with the new employee
      setResponseData((prevData) => [...prevData, response]);
      setShowAddModal(false);
      setNewEmployee({ name: "", email: "", password: "", dept_id: "", phone: "", remarks: "" });
    } catch (err: any) {
      console.error("Error adding employee:", err);
      setError(err.response?.data?.message || "Failed to add employee.");
    }
  };
  

  // Fetch and patch employees on component mount
  useEffect(() => {
    fetchAndPatchEmployees();
  }, []);

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
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      <div className="mt-4">
        {responseData.length > 0 && (
          <Table columns={columns} data={responseData} />
        )}
        {error && (
          <div>
            <h3 className="text-red-500">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              Delete {selectedEmployee.name}?
            </h3>
            <p className="mb-4">Are you sure you want to delete this employee?</p>
            <div className="flex justify-end space-x-4">
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
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Employee</h3>
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Dept_id:</label>
              <input
                type="dept_id"
                value={newEmployee.dept_id}
                onChange={(e) => setNewEmployee({ ...newEmployee, dept_id: e.target.value })}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Phone No. :</label>
              <input
                type="phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Remarks:</label>
              <input
                type="remarks"
                value={newEmployee.remarks}
                onChange={(e) => setNewEmployee({ ...newEmployee, remarks: e.target.value })}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addEmployee}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchPatchRequestComponent;








