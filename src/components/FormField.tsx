"use client";

import React from "react";

function labelShow(labelName:string){
   if(labelName==='phone_number')return 'Phone Number';
   if(labelName==='dept_name'){
    return 'Department';
   }
   if(labelName==='remarks')return 'Notes';
   return labelName;
}

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  isEditable: boolean;
  onChange?: (value: string) => void;
  options?: string[];
  type?:string;
};

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  isEditable,
  onChange,
  options,
  type='text',
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="block w-full mb-2 font-medium text-sm text-gray-500 capitalize">
        {labelShow(label)}
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
            type={`${type}`}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="bg-gray-200 rounded-md px-4 py-2 flex-1 border border-gray-200"
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
