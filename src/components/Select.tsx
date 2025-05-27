"use client";
import React from "react";

interface SelectProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | number }[];
  className?: string;
  disabledOption?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className = "",
  disabledOption,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border px-4 py-2 w-full rounded ${className}`}
    >
      {disabledOption && (
        <option value="" disabled>
          {disabledOption}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
