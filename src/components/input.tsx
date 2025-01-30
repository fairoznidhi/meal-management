import React, { FC, HTMLAttributes, HtmlHTMLAttributes, InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  togglePasswordVisibility?: boolean;
}
const Input:FC<InputProps> = ({
  label="",
  id="",
  type = "text",
  className = "",
  togglePasswordVisibility = false,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);

  const handleToggleVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )} 
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`bg-gray-100 rounded-md w-80 px-5 py-2 ${className}`}
          {...props}
        />
        {togglePasswordVisibility && type === "password" && (
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="absolute right-3 top-2 text-gray-600"
          >
            {inputType === "password" ? "Show" : "Hide"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
