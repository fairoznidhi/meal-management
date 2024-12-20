"use client"
import React, { useState } from "react";
import Table, {Column,Row} from "@/components/Table";
import Search from "@/components/Search";
const employee=()=>{
  const columns:Column[] = [
    { key: "name", label: "Name"},
    { key: "penalties", label: "Penalties"},
    { key: "notes", label: "Notes"},
  ];

  const initialData:Row[] = [
    { name: "Alice", penalties: "2", notes: "No Beef" },
    { name: "Bob", penalties: "1", notes: "No Fish" },
  ];

 
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((row) =>
    columns.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddRow = () => {
    const newRow: Row = {};
    columns.forEach((col) => (newRow[col.key] = ""));
    setData([...data, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };
    return (
        <div className="m-5 items-center justify-center">

        {/*<Form></Form>*/}
        
        <div className="p-4">
        <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="mt-40">
      <Table
        columns={columns}
        data={filteredData}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
       
      />
      </div>
      <button className="rounded bg-blue-400 px-2 py-1 mt-7 text-white">
         +
      </button>

    </div>
      </div>
    );
}
export default employee