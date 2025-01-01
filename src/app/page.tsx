"use client";

{/*import React, { useState } from "react";
import ExtendedTable from "@/features/dashboard/AdminDashTable";
import { Row } from "@/components/Table";
import AdminDashTable from "@/features/dashboard/AdminDashTable";

const EmployeeSchedule = () => {
  // Initial data
  const [data, setData] = useState<Row[]>([
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
  ]);

  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;
    setData(updatedData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Weekly Schedule</h1>
      <AdminDashTable data={data} onEditRow={handleEditRow} />
    </div>
  );
};

export default EmployeeSchedule;*/}

// pages/employees.tsx

// src/app/employees/page.tsx






import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Table, { Column, Row } from "@/components/Table";
import Search from "@/components/Search";

const fetchEmployeeData = async () => {
  const response = await fetch('/api/employee');
  if (!response.ok) {
    throw new Error('Failed to fetch employee data');
  }
  return response.json(); // Assuming the API returns an array of employee data
};

const Employee = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use `useQuery` to fetch employee data
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'], // Unique key for this query
    queryFn: fetchEmployeeData,
  });

  // Filter data based on the search term
  const filteredData = employees.filter((row: Row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "remarks", label: "Remarks" },
  ];

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

export default Employee;



