"use client";
import React, { useState } from "react";
export type Column = {
  key: string; // Unique key for the column
  label: string; // Display name for the column
  editable?: boolean; // Whether the column is editable
  render?: (
    value: any,
    row: Row,
    rowIndex: number,
    onEdit: (key: string, value: any) => void
  ) => React.ReactNode; // Custom render function
  render?: (
    value: any,
    row: Row,
    rowIndex: number,
    onEdit: (key: string, value: any) => void
  ) => React.ReactNode; // Custom render function
};

export type Row = {
  [key: string]: any; // Dynamic object to hold row data
};
type TableProps = {
  columns: Column[];
  data: Row[];
  hideheader?: boolean;
  onEditRow?: (updatedRow: Row, rowIndex: number) => void; // Callback for editing rows
  title?: string; // Optional title for the table
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  hideheader=false,

  onEditRow,
  title,
}) => {
  const [editState, setEditState] = useState<{ [key: string]: string }>({});

  const handleInputChange = (key: string, value: string, rowIndex: number) => {
    const updatedRow = { ...data[rowIndex], [key]: value };
    onEditRow && onEditRow(updatedRow, rowIndex);
  };

  return (
    <div className="overflow-x-auto">
      {title && <p className="text-xl font-bold my-4">{title}</p>}
      <table className="table-auto w-full">
        {!hideheader&&(<thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-gray-300 px-4 py-2 bg-[#D7DFE9] text-center"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>)}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                <td
                  key={col.key}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  {col.render ? (
                    col.render(row[col.key], row, rowIndex)
                  ) : col.editable ? (
                    <input
                      type="text"
                      value={row[col.key]}
                      onChange={(e) =>
                        handleInputChange(col.key, e.target.value, rowIndex)
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
  );
};

export default Table;
