import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Enter password",
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
