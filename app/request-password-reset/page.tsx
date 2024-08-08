// app/request-password-reset/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { FiMail } from "react-icons/fi";

export default function RequestPasswordReset() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      // Redirect to reset-password page with email as query parameter
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError("Failed to request password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <h2
        className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        Reset Your Password
      </h2>
      <p
        className={`mt-2 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        Enter your email to receive a password reset link
      </p>
      {error && (
        <div className="mt-4 text-red-500 text-center bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email-address"
            className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail
                className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none block w-full px-3 py-2 pl-10 ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              } rounded-md focus:outline-none focus:z-10 sm:text-sm`}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            } transition transform hover:scale-105 hover:shadow-lg duration-150 ease-in-out`}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
