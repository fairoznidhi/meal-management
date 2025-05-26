import React from "react";

type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type: "text" | "email" | "select";
  options?: { value: string; label: string }[]; // for select type
};

type EmployeeDetailsProps<T> = {
  data: T;
  isEditing: boolean;
  updatedData?: T;
  setUpdatedData?: (value: T) => void;
  fields: FieldConfig<T>[];
};

function EmployeeDetails<T extends Record<string, any>>({
  data,
  isEditing,
  updatedData,
  setUpdatedData,
  fields,
}: EmployeeDetailsProps<T>) {
  return (
    <div className="space-y-4">
      {fields.map(({ key, label, type, options }) => (
        <div key={String(key)}>
          <strong>{label}:</strong>
          {isEditing ? (
            type === "select" && options ? (
              <select
                value={updatedData?.[key] || ""}
                onChange={(e) =>
                  setUpdatedData &&
                  setUpdatedData({ ...updatedData!, [key]: e.target.value })
                }
                className="border px-4 py-2 w-full rounded"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={updatedData?.[key] || ""}
                onChange={(e) =>
                  setUpdatedData &&
                  setUpdatedData({ ...updatedData!, [key]: e.target.value })
                }
                className="border px-4 py-2 w-full rounded"
              />
            )
          ) : (
            <span>{data[key] || "N/A"}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default EmployeeDetails;
