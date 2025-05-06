"use client";

{/*import React from "react";

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





import React from "react";
import { useState } from "react";


function labelShow(labelName: string) {
  if (labelName === "phone_number") return "Phone Number";
  if (labelName === "dept_name") return "Department";
  if (labelName === "remarks") return "Notes";
  if (labelName === "food_preference") return "Food Preferences";
  return labelName;
}



type FormFieldProps = {
  id: string;
  label: string;
  value: number[]; // Store selected food IDs
  isEditable: boolean;
  onChange?: (value: number[]) => void;
  options?: { food: string; food_id: number }[]; // Store food name and ID
  type?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  isEditable,
  onChange,
  options,
  type = "text",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col relative">
      <label htmlFor={id} className="block w-full mb-2 font-medium text-sm text-gray-500 capitalize">
        {labelShow(label)}
      </label>
      {isEditable ? (
        label === "food_preference" && options ? (
          <div>
            {/* Clickable dropdown opener 
            <div
              className="bg-gray-100 rounded-md px-4 py-2 border border-gray-200 cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {value.length > 0
                ? options
                    .filter((opt) => value.includes(opt.food_id))
                    .map((opt) => opt.food)
                    .join(", ")
                : "Select Food Preferences"}
            </div>

            {/* Dropdown menu 
            {isDropdownOpen && (
              <div className="absolute bg-white border rounded shadow-md w-full mt-1 p-2 z-10">
                {options.map((option) => (
                  <label key={option.food_id} className="block p-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.food_id}
                      checked={value.includes(option.food_id)}
                      onChange={(e) => {
                        if (onChange) {
                          let newValue = [...value];
                          const foodId = option.food_id;

                          if (e.target.checked) {
                            newValue.push(foodId);
                          } else {
                            newValue = newValue.filter((id) => id !== foodId);
                          }
                          onChange(newValue);
                        }
                      }}
                      className="mr-2"
                    />
                    {option.food}
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            id={id}
            type={type}
            value={value as unknown as string} // Convert number[] to string for other fields
            onChange={(e) => onChange && onChange([parseInt(e.target.value, 10)])}
            className="bg-gray-200 rounded-md px-4 py-2 border border-gray-200"
          />
        )
      ) : (
        <span className="bg-gray-100 rounded-md px-4 py-2 border border-gray-200">
          {options
            ?.filter((opt) => value.includes(opt.food_id))
            .map((opt) => opt.food)
            .join(", ")}
        </span>
      )}
    </div>
  );
};

export default FormField;
*/}




import React, { useState } from "react";


function labelShow(labelName: string) {
  if (labelName === "phone_number") return "Phone Number";
  if (labelName === "dept_name") return "Department";
  if (labelName === "remarks") return "Notes";
  if (labelName === "preference_food") return "Allergies/Aversions";
  return labelName;
}



type FormFieldProps = {
  id: string;
  label: string;
  value: string | number[]; // Accepts string for text fields, number[] for food preferences
  isEditable: boolean;
  onChange?: (value: string | number[]) => void;
  options?: { food_id: number; food: string }[]; // List of food options
  type?: string;
  labelShow?: (label: string) => string; // Custom label display function
};

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  isEditable,
  onChange,
  options,
  type = "text",
  //labelShow = (label) => label,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ensure value is always an array for food preference
  const selectedFoodIds = Array.isArray(value) ? value : [];

  // Get food names from selected IDs
  const selectedFoods =
    options?.filter((opt) => selectedFoodIds.includes(opt.food_id)).map((opt) => opt.food).join(", ") || "";

  return (
    <div className="flex flex-col relative">
      <label htmlFor={id} className="block w-full mb-2 font-medium text-sm text-gray-500 capitalize">
        {labelShow(label)}
      </label>
      
      {/* Editable Mode */}
      {isEditable ? (
        label === "preference_food" && options ? (
          <div>
            {/* Clickable Dropdown Opener */}
            <div
              className="bg-gray-200 rounded-md px-4 py-2 border border-gray-200 cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {selectedFoods || "Select Options"}
            </div>

            {/* Dropdown Menu - Shows ALL options, with selected ones checked */}
            {isDropdownOpen && (
              <div className="absolute bg-white border rounded shadow-md w-full mt-1 p-2 z-10">
                {options.map((option) => (
                  <label key={option.food_id} className="block p-2 hover:bg-gray-100 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      value={option.food_id}
                      checked={selectedFoodIds.includes(option.food_id)}
                      onChange={(e) => {
                        if (onChange) {
                          let newValue = [...selectedFoodIds];
                          const foodId = option.food_id;

                          if (e.target.checked) {
                            newValue.push(foodId);
                          } else {
                            newValue = newValue.filter((id) => id !== foodId);
                          }
                          onChange(newValue);
                        }
                      }}
                      className="mr-2"
                    />
                    {option.food}
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : options ? (
          // Other Select Fields
          <select
            id={id}
            value={value as string}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-200"
           
          >
            {options.map((option) => (
              <option key={option.food_id} value={option.food_id}>
                {option.food}
              </option>
            ))}
          </select>
        ) : (
          // Other Input Fields
          <input
            id={id}
            type={type}
            value={value as unknown as string}
            onChange={(e) => onChange && onChange(e.target.value)}
            //className="bg-gray-200 rounded-md px-4 py-2 flex-1 border border-gray-200"
            disabled={label === "email" || label === "dept_name"}
            className={`bg-gray-200 rounded-md px-4 py-2 flex-1 border border-gray-200 ${
            label === "email" || label === "dept_name" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            
          />
        )
      ) : (
        // View Mode - Show Selected Food Names OR "No preferences selected"
        <span className="bg-gray-100 rounded-md px-4 py-2 flex-1 border border-gray-200">
          {label === "preference_food" ? selectedFoods || "No options selected" : value}
        </span>
      )}
    </div>
  );
};

export default FormField;
