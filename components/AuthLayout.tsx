// components/AuthLayout.tsx
import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

interface AuthLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  darkMode,
  setDarkMode,
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: darkMode
            ? "radial-gradient(circle at 25px 25px, #2A4365 2%, transparent 0%), radial-gradient(circle at 75px 75px, #2A4365 2%, transparent 0%)"
            : "radial-gradient(circle at 25px 25px, #E2E8F0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #E2E8F0 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      ></div>
      <div
        className="absolute inset-0 z-10 opacity-30"
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(45deg, #4299E1 25%, transparent 25%, transparent 50%, #4299E1 50%, #4299E1 75%, transparent 75%, transparent)"
            : "linear-gradient(45deg, #BEE3F8 25%, transparent 25%, transparent 50%, #BEE3F8 50%, #BEE3F8 75%, transparent 75%, transparent)",
          backgroundSize: "60px 60px",
        }}
      ></div>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-white text-gray-800 hover:bg-gray-200"}`}
        >
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </div>
      <div className="max-w-md w-full space-y-8 relative z-20">
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-2xl rounded-lg p-10 backdrop-blur-sm bg-opacity-90`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
