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
    <div className="flex items-center">
      <label
        htmlFor={id}
        className="block w-32 font-medium text-gray-700 capitalize"
      >
        {label}:
      </label>
      {isEditable ? (
        options ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-300"
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
            className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-300"
          />
        )
      ) : (
        <span className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-300">
          {value}
        </span>
      )}
    </div>
  );
};

export default FormField;
