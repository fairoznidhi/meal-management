"use client"

import React, {useState} from "react";
import { useAllEmployees } from "@/services/EmployeeList/queries";
import Table, { Column, Row } from "@/components/Table";
import Search from "@/components/Search";

const EmployeeList = () => {
  const { data: employees = [], isLoading, error } = useAllEmployees();
 
  const [searchTerm, setSearchTerm] = useState("");
  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "remarks", label: "Remarks" },
  ];
  const filteredData = employees.filter((row: Row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.remarks.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="m-5 items-center justify-center">
      <div className="p-4">
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="mt-40">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <Table columns={columns} data={filteredData} />
        )}
      </div>
      </div>
    </div>
  );
};

export default EmployeeList;


{/*import React, { useState } from "react";
import Table, { Column, Row } from "@/components/Table";
import Search from "@/components/Search";
import Modal from "@/components/modal";

const Employee = () => {
  // Columns for employee data display
  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "penalties", label: "Penalties" },
    { key: "notes", label: "Notes" },
  ];

  // Columns for adding new employee (modal)
  const employeeColumns: Column[] = [
    { key: "employee_id", label:"Employee_id"},
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
   // { key: "phone", label: "Phone Number" },
    { key: "dept_id", label: "Department" },
    
    { key: "remarks", label: "remarks"},
    { key: "default_status", label: "default_status"},
  ];

  const initialData: Row[] = [
    { name: "Alice", penalties: "2", notes: "No Beef" },
    { name: "Bob", penalties: "1", notes: "No Fish" },
    { name: "Charlie", penalties: "3", notes: "No Fish" },
    { name: "David", penalties: "0", notes: "No Dairy" },
  ];

  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRow, setNewRow] = useState<Row>({
    employee_id:"",
    name: "",
    email: "",
    password: "",
    dept_id:"",
    remarks: "",
    status:"active",//default status
    
  });

  // Filter data based on name and notes
  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*const handleAddRow = () => {
    
    setData([...data, newRow]);
    setNewRow({ name: "", email: "", phone: "", department: "Development", password: "" });
    setIsModalOpen(false); // Close modal after adding
  };*/

  {/*const handleAddRow = async () => {
    try {
      const response = await fetch('/api/create_user', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(newRow),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create user:${errorData.message || response.statusText}`);
      }
  
      const result = await response.json();
      console.log("User created:", result.user);
  
      // Update the table with the new user
      setData([...data, newRow]);
      setNewRow({ employee_id:"",name: "", email: "", password: "", dept_id: "", remarks: "", status:"active" });
      setIsModalOpen(false); // Close modal after adding
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };
  

  const handleDeleteRow = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const handleNewRowChange = (key: string, value: string) => {
    setNewRow((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="m-5 items-center justify-center">
      <div className="p-4">
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="mt-40">
          {/* Table displaying employee data */}
     {/*     <Table columns={columns} data={filteredData} />
        </div>
        <button
          className="rounded bg-blue-400 px-2 py-1 mt-7 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {/* Modal for adding a new employee */}
      {/*<Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRow}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {employeeColumns.map((col) => (
            <div key={col.key} className="flex items-center">
              <label
                htmlFor={col.key}
                className="block w-32 font-medium text-gray-700 capitalize"
              >
                {col.label}:
              </label>
              {col.key === "department" ? (
                <select
                  id={col.key}
                  value={newRow[col.key] || "Development"}
                  onChange={(e) => handleNewRowChange(col.key, e.target.value)}
                  className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-300"
                >
                  <option value="1">Development</option>
                  <option value="2">Call Center</option>
                  <option value="3">Sales</option>
                  <option value="4">HR</option>
                </select>
              ) : (
                <input
                  id={col.key}
                  type={col.key === "password" ? "password" : "text"}
                  value={newRow[col.key] || ""}
                  onChange={(e) => handleNewRowChange(col.key, e.target.value)}
                  className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-300"
                />
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Employee;
*/}
      }
