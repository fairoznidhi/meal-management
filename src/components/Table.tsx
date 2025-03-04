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
    // onEdit: (key: string, value: any) => void
  ) => React.ReactNode; // Custom render function
  renderRow?: (row: Row, rowIndex: number) => string | undefined;
  renderCellStyle?: (value: any, row: Row, rowIndex: number) => string;
};

export type Row = {
  [key: string]: any; // Dynamic object to hold row data
};
type TableProps = {
  columns: Column[];
  data: Row[];
  onEditRow?: (updatedRow: Row, rowIndex: number) => void; // Callback for editing rows
  title?: string; // Optional title for the table
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onEditRow,
  title,
}) => {
  const [editState, setEditState] = useState<{ [key: string]: string }>({});

  const handleInputChange = (key: string, value: string, rowIndex: number) => {
    const updatedRow = { ...data[rowIndex], [key]: value };
    onEditRow && onEditRow(updatedRow, rowIndex);
  };

  return (
    <div className="overflow-y-auto sm:max-h-[400px] md:max-h-[500px] lg:max-h-[650px] max-lg:max-h-[800px] overflow-hidden rounded-t-lg">
      {title && <p className="text-xl font-bold my-4">{title}</p>}
      <table className="table-auto w-full">
        <thead className="bg-gray-200 border-gray-200 sticky top-0">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-2  py-4 text-center whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowStyle = columns.find(col => col.renderRow)?.renderRow!(row, rowIndex);
            return (
              <tr key={rowIndex} className={`${rowStyle} hover:bg-gray-100`}>
              {columns.map((col) => {
                const cellStyle = col.renderCellStyle?.(row[col.key], row, rowIndex) || "";
                return (
                  <td
                    key={col.key}
                    className={`border border-gray-100 p-2 text-center ${cellStyle}`}
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
                )
              })}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;