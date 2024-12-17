"use client"
import React from 'react'
import { ButtonType } from './button.type'

const Button = ({
  
    label,
    size,
    className,
    ...restProps
    }  :ButtonType) => {
    const buttonStyle = [""]

  return (
    <button 
    className={`btn bg-lightBlue hover:bg-darkBlue text-white ${className}, 
    ${size === "sm" ? "px-2":"px-4"} ${buttonStyle}`}
    {...restProps}>{label}</button>
  )
}

export default Button
