"use client";
import { ButtonType } from "./button.type";

const Button = ({
  label,
  size,
  fillButton = true,
  utilityButton = false,
  settingsButton = false,
  updateButton = false,
  deleteButton = false,
  cancelButton = false,
  successButton = false,
  shapeButton = false,
  login = false,
  className,
  disable = false,
  custom = false,
  ...restProps
}: ButtonType) => {
  const buttonStyle = ["transition duration-300 ease-in-out"];

  return (
    <button
      className={`shadow-none outline-none ${className} ${
        custom === true
          ? "btn"
          : disable
          ? "opacity-50 cursor-not-allowed"
          : utilityButton === true
          ? "btn bg-blue-200 hover:bg-blue-300 px-3 rounded-md text-midnightBlue text-xl"
          : shapeButton == true
          ? "text-gray-300 text-4xl rounded hover:text-gray-400"
          : settingsButton == true
          ? "flex items-center px-4 py-2 bg-gray-50 mt-2 hover:bg-gray-100 rounded font-medium w-full transition duration-300 ease-in-out text-gray-600"
          : login === true
          ? "btn bg-lightBlue hover:bg-darkBlue text-white rounded-md"
          : updateButton === true
          ? "btn bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-md"
          : successButton === true
          ? "btn bg-green-300 hover:bg-green-400 text-green-800 rounded-md"
          : deleteButton === true
          ? "btn bg-red-200 hover:bg-red-300 text-red-700 rounded-md"
          : cancelButton === true
          ? "btn bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-md"
          : fillButton === true
          ? "btn bg-blue-200 hover:bg-blue-300 text-midnightBlue rounded-md"
          : "btn bg-transparent hover:bg-transparent border-lightBlue hover:border-darkBlue"
      }
    ${
      size === "sm"
        ? "px-2"
        : size === "md"
        ? "px-4"
        : size === "lg"
        ? "px-6"
        : size === "xlg"
        ? "px-8"
        : size === "full"
        ? "w-full"
        : size === "none"
        ? ""
        : "px-6"
    } ${buttonStyle}`}
      disabled={disable}
      {...restProps}
    >
      {label}
    </button>
  );
};

export default Button;
