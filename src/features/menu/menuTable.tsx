import React, { useState } from "react";

type Row = { [key: string]: string };
type Column = { key: string; label: string };

interface MenuTableProps {
  columns: Column[];
  data: Row[];
  onSaveChanges?: (updatedData: Row[]) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({ columns, data, onSaveChanges }) => {
  const [viewMode, setViewMode] = useState(true); // Initially in view mode
  const [editableData, setEditableData] = useState<Row[]>(data);

  const toggleEditMode = () => {
    setViewMode(!viewMode);
  };

  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][key] = value;
    setEditableData(updatedData); // Update the data in editable mode
  };

  const handleSaveChanges = () => {
    onSaveChanges && onSaveChanges(editableData);
    setViewMode(true); // Switch back to view mode after saving
  };

  return (
    <div>
      <div className="flex justify-end my-2">
        <button
          onClick={toggleEditMode}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {viewMode ? "Edit" : "View"}
        </button>
        {!viewMode && (
          <button
            onClick={handleSaveChanges}
            className="bg-green-500 text-white px-4 py-2 ml-2 rounded"
          >
            Save Changes
          </button>
        )}
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-gray-300 px-4 py-2 bg-gray-100 text-center"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  {viewMode ? (
                    row[col.key] // Display data in view mode
                  ) : (
                    <input
                      type="text"
                      value={row[col.key]}
                      onChange={(e) =>
                        handleInputChange(rowIndex, col.key, e.target.value)
                      }
                      className="w-full px-2 py-1 text-center"
                    />
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

export default MenuTable;
