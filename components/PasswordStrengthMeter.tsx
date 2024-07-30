// components/PasswordStrengthMeter.tsx
import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    if (password.length < 8) return 1;
    if (password.length < 12) return 2;
    if (password.length >= 12) return 3;
    return 4;
  };

  const strength = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case 0:
        return "bg-gray-300";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const getMessage = () => {
    switch (strength) {
      case 0:
        return "Enter a password";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password strength
        </span>
        <span
          className={`text-sm font-medium ${getColor().replace("bg-", "text-")}`}
        >
          {getMessage()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${getColor()}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
