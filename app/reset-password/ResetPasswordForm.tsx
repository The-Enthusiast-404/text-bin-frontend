// app/reset-password/ResetPasswordForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { FiLock, FiKey } from "react-icons/fi";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(token, password);
      // Redirect to sign-in page after successful password reset
      router.push("/signin?resetSuccess=true");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
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
        Enter the reset token sent to {email} and your new password.
      </p>
      {error && (
        <div className="mt-4 text-red-500 text-center bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="mb-4">
            <label
              htmlFor="reset-token"
              className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}
            >
              Reset Token
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiKey
                  className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </div>
              <input
                id="reset-token"
                name="token"
                type="text"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                } rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Enter reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="new-password"
              className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}
            >
              New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock
                  className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </div>
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                } rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
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
            } transition duration-150 ease-in-out`}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Remember your password?{" "}
          <Link
            href="/signin"
            className={`font-medium ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
