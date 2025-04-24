"use client";

import { InputType } from "./input.type";
import "./input.style.css";
import { useState } from "react";
import { IoMdEye,IoMdEyeOff  } from "react-icons/io";

const Input = ({
  type,
  name,
  placeholder,
  className,
  ...restProps
}: InputType) => {
  const [showPassword,setShowPassword]=useState(false);
  return (
    <div className="w-full">
      <h1 className="mb-1 ml-1">{placeholder}</h1>
      <label
        className={`input input-bordered flex items-center gap-2 mb-2 w-full ${className}`}
      >
        <input
          type={type=='password'?showPassword?'text':'password':type}
          className="w-full outline-none focus:bg-white"
          placeholder={placeholder}
          name={name}
          {...restProps}
        />
        {type=='password' &&
        <span className="text-gray-400" onClick={()=>setShowPassword((prev)=>!prev)}>
          {showPassword?<IoMdEye size={20}/>:<IoMdEyeOff size={20}/>}
        </span>
        }

      </label>
    </div>
  );
};

export default Input;
