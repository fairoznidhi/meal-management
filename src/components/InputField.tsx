"use client";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
interface InputFieldType extends React.InputHTMLAttributes<HTMLInputElement> {
    eyeButton?:boolean
}
export default function InputField({
  type = "text",
  placeholder,
  ...props
}: InputFieldType) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-full">
      <input
        type={type == "password" ? (showPassword ? "text" : type) : type}
        placeholder={placeholder}
        {...props}
        className="w-full border rounded-l py-2 px-4 outline-1 outline-gray-200 relative"
      />
      {type == "password" && (
        <span
          className="text-gray-400 absolute right-3 top-3 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
        </span>
      )}
    </div>
  );
}
