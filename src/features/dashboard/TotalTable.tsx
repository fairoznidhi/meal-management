"use client";


import React from "react";
import Table, { Column, Row } from "@/components/Table"; // Adjust the path as needed

const TotalTable = () => {
  // Define columns
  const columns: Column[] = [
    { key: "header", label: "Header", editable: false }, // First column
    { key: "col1", label: "", editable: true },
    { key: "col2", label: "", editable: true },
    { key: "col3", label: "", editable: true },
    { key: "col4", label: "", editable: true },
    { key: "col5", label: "", editable: true },
    { key: "col6", label: "", editable: true },
    { key: "col7", label: "", editable: true },
  ];

  // Define data (1 row with empty values for columns)
  const data: Row[] = [
    {
      header: "Total Daily Meals",
      col1: "",
      col2: "",
      col3: "",
      col4: "",
      col5: "",
      col6: "",
      col7: "",
    },
  ];

  // Handle row edits
  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    console.log("Updated Row:", updatedRow, "at index:", rowIndex);
  };

  return (
    <div className="">
      
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="border border-gray-300 px-4 py-2 text-center w-auto"
                  >
                    {col.editable ? (
                      <input
                        type="text"
                        value={row[col.key]}
                        onChange={(e) =>
                          handleEditRow(
                            { ...row, [col.key]: e.target.value },
                            rowIndex
                          )
                        }
                        className="px-2 py-1 text-center w-full"
                      />
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalTable;
