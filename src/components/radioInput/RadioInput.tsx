import React from 'react';
import './radioInput.style.css'
import { RadioInputType } from './radioInput.type';

const RadioInput = ({
    label,
    className,
   ...restProps
}:RadioInputType) => {
    return (
        <div className='mydict'>
            <label>
                <input type="radio" className={`${className}`} {...restProps}/>
                <span>{label}</span>
            </label>
        </div>
    );
};

export default RadioInput;