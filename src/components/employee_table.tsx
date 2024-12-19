"use client"
import React, { useState } from "react";

type Column = {
  key: string; // Unique key for the column
  label: string; // Display name for the column
};

type Row = {
  [key: string]: any; // Dynamic object to hold row data
};

type GenericTableProps = {
  columns: Column[];
  initialData: Row[];
};

const EmpTable: React.FC<GenericTableProps> = ({ columns, initialData }) => {
  const [data, setData] = useState(initialData);

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
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-gray-300 px-4 py-2 text-left bg-gray-100 text-center"
              >
                {col.label}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key} className="border border-gray-300 px-4 py-2 text-center">
                  {row[col.key]}
                </td>
              ))}
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleDeleteRow(rowIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 rounded"
      >
        +
      </button>
    </div>
  );
};

export default EmpTable;


