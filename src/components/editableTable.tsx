import { useState } from "react";

interface TableRow {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface EditableTableProps {
  data: TableRow[];
  onSave: (updatedData: TableRow[]) => void;
}

export default function EditableTable({ data, onSave }: EditableTableProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<TableRow[]>(data);

  const handleChange = (id: number, field: keyof TableRow, value: string | number) => {
    setEditedData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    onSave(editedData);
    setEditMode(false);
  };

  return (
    <div className="p-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border">
              {editMode ? (
                <>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={editedData.find((r) => r.id === row.id)?.name || ""}
                      onChange={(e) => handleChange(row.id, "name", e.target.value)}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={editedData.find((r) => r.id === row.id)?.age || ""}
                      onChange={(e) => handleChange(row.id, "age", Number(e.target.value))}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="email"
                      value={editedData.find((r) => r.id === row.id)?.email || ""}
                      onChange={(e) => handleChange(row.id, "email", e.target.value)}
                      className="border p-1 w-full"
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{row.name}</td>
                  <td className="border p-2">{row.age}</td>
                  <td className="border p-2">{row.email}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        {editMode ? (
          <>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 mr-2">Save</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2">Edit</button>
        )}
      </div>
    </div>
  );
}
