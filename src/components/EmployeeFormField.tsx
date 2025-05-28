import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  placeholder:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  onBlur?: () => void;
  showPasswordToggle?: boolean;
}

const EmployeeFormField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  options,
  onBlur,
  error,
  required,
  showPasswordToggle = false,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block mb-2 relative">
        <span>{label}:</span>
        {required && <span className="absolute top-0 left-18 text-red-500">*</span>}
      </label>

      {type === "select" && options ? (
        <select
          value={value}
          onChange={onChange}
          className={`border px-4 py-2 w-full rounded bg-gray-100 ${
            value ? "text-black" : "text-gray-400"
          }`}
        >
          <option value="" disabled className="text-gray-400">
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            className="border px-4 py-2 w-full rounded"
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default EmployeeFormField;
