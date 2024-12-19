"use client"

import { InputType } from "./input.type";
import './input.style.css'

const Input = ({
    type,
    name,
    placeholder,
    className,
    ...restProps
    }:InputType) => {
    return (
        <div>
            <h1 className="mb-1 ml-1">{placeholder}</h1>
            <label className={`input input-bordered flex items-center gap-2 mb-2
                
                ${className}`}>
               <div className=":focus-visible:outline-none  :focus-within:outline-none">
               <input 
                   type={type} 
                   className={`grow`} 
                   placeholder={placeholder} 
                   name={name}
                   {...restProps}
                   />
               </div>
             </label>
        </div>
    );
};

export default Input;