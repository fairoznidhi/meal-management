"use client";

import React from "react";

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  isEditable: boolean;
  onChange?: (value: string) => void;
  options?: string[]; // Optional for dropdowns
};

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  isEditable,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block w-fill mb-2 font-medium text-sm text-gray-500 capitalize"
      >
        {label}
      </label>
      {isEditable ? (
        options ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-200"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-200"
          />
        )
      ) : (
        <span className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-200">
          {value}
        </span>
      )}
    </div>
  );
};

export default FormField;
