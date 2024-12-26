"use client"

import React, { useState } from "react";
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
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone Number" },
    { key: "department", label: "Department" },
    { key: "password", label: "Password" },
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
    name: "",
    email: "",
    phone: "",
    department: "Development",
    password: "",
  });

  // Filter data based on name and notes
  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRow = () => {
    setData([...data, newRow]);
    setNewRow({ name: "", email: "", phone: "", department: "Development", password: "" });
    setIsModalOpen(false); // Close modal after adding
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
          <Table columns={columns} data={filteredData} />
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
              {col.key === "department" ? (
                <select
                  id={col.key}
                  value={newRow[col.key] || "Development"}
                  onChange={(e) => handleNewRowChange(col.key, e.target.value)}
                  className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-300"
                >
                  <option value="Development">Development</option>
                  <option value="Call Center">Call Center</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
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
