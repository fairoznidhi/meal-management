import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({  children, className, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded text-white font-semibold focus:outline-none';

  return (
    <button
      className={`${baseStyles}  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
