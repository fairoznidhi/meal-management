"use client"

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Table, { Column, Row } from "@/components/Table";
import Search from "@/components/Search";
import Modal from "@/components/modal";

// Fetch employee data from the API
const fetchEmployees = async () => {
  const response = await fetch('/api/employee');
  if (!response.ok) {
    throw new Error('Failed to fetch employee data');
  }
  return response.json();
};

// Add a new employee
const addEmployee = async (newEmployee: Row) => {
  const response = await fetch('/api/create_user', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEmployee),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create user: ${errorData.message || response.statusText}`);
  }

  return response.json();
};

const Employee = () => {
  // Columns for employee data display
  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "remarks", label: "Remarks" },  // Add remarks column
  ];

  // Columns for adding new employee (modal)
  const employeeColumns: Column[] = [
    { key: "employee_id", label: "Employee_id" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "dept_id", label: "Department" },
    { key: "remarks", label: "Remarks" },
    { key: "default_status", label: "Default Status" },
  ];

  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRow, setNewRow] = useState<Row>({
    employee_id: "",
    name: "",
    email: "",
    password: "",
    dept_id: "",
    remarks: "",
    status: "active", // default status
  });

  // Query client to invalidate cache after mutation
  const queryClient = useQueryClient();

  // Fetch employee data using TanStack Query's useQuery
  const { data, isLoading, isError, error } = useQuery(
    ['employees'],
    fetchEmployees
  );

  // Mutation for adding a new employee
  const mutation = useMutation(addEmployee, {
    onSuccess: () => {
      // Invalidate and refetch employee data after adding a new employee
      queryClient.invalidateQueries(['employees']);
      setIsModalOpen(false); // Close modal
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  });

  // Filter data based on name or remarks
  const filteredData = data?.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRow = () => {
    mutation.mutate(newRow); // Call mutation to add a new employee
  };

  const handleNewRowChange = (key: string, value: string) => {
    setNewRow((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>;

  return (
    <div className="m-5 items-center justify-center">
      <div className="p-4">
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="mt-40">
          {/* Table displaying employee data */}
          <Table columns={columns} data={filteredData || []} />
        </div>
        <button
          className="rounded bg-blue-400 px-2 py-1 mt-7 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {/* Modal for adding a new employee */}
      <Modal
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
              {col.key === "dept_id" ? (
                <select
                  id={col.key}
                  value={newRow[col.key] || "1"}
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
