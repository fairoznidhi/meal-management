"use client";

import { InputType } from "./input.type";
import "./input.style.css";

const Input = ({
  type,
  name,
  placeholder,
  className,
  ...restProps
}: InputType) => {
  return (
    <div className="w-full">
      <h1 className="mb-1 ml-1">{placeholder}</h1>
      <label
        className={`input input-bordered flex items-center gap-2 mb-2 w-full ${className}`}
      >
        <input
          type={type}
          className="w-full outline-none focus:ring-0"
          placeholder={placeholder}
          name={name}
          {...restProps}
        />
      </label>
    </div>
  );
};

export default Input;
