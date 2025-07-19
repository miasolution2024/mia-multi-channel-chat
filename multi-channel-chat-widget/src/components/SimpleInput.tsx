import React from "react";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const SimpleInput: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                 focus:ring-[0.5px] focus:ring-primary-500 focus:border-primary-500
                 focus-visible:outline-none
                 transition-colors placeholder-neutral-400"
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">{error}</p>
      )}
    </div>
  );
};

export default SimpleInput;
