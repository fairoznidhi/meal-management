"use client";
import { ButtonType } from "./button.type";

const Button = ({
  label,
  size,
  fillButton = true,
  className,
  disable = false,
  ...restProps
}: ButtonType) => {
  const buttonStyle = [""];

  return (
    <button
      className={`btn ${className} ${
        fillButton === true
          ? "bg-lightBlue hover:bg-darkBlue text-white"
          : "bg-transparent hover:bg-transparent border-lightBlue hover:border-darkBlue"
      }
    ${size === "sm" ? "px-2" : "px-4"} ${buttonStyle}`}
    disabled={disable}
      {...restProps}
    >
      {label}
    </button>
  );
};

export default Button;
