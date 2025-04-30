"use client";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
export interface InputFieldType extends React.InputHTMLAttributes<HTMLInputElement> {
  eyeButton?: boolean;
}
export default function InputField({
  type = "text",
  placeholder,
  value,
  eyeButton = true,
  ...props
}: InputFieldType) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative mb-2 w-full">
      <input
        type={type == "password" ? (showPassword ? "text" : type) : type}
        placeholder={placeholder}
        {...props}
        className="w-full border rounded-l py-3 px-4 outline-1 outline-gray-200 relative"
      />
      {type == "password" && eyeButton && (
        <span
          className="text-gray-400 absolute right-3 top-4 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
        </span>
      )}
    </div>
  );
}
