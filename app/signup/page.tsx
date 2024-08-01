"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { FiUser, FiMail } from "react-icons/fi";
import Link from "next/link";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import PasswordInput from "@/components/PasswordInput";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    setIsPasswordValid(password.length >= 8 && password.length <= 32);
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Password must be between 8 and 32 characters long.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await signUp(name, email, password);
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <h2
        className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        Create your account
      </h2>
      {error && (
        <div className="mt-4 text-red-500 text-center bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}
            >
              Full name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser
                  className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                } rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
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
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}
            >
              Password
            </label>
            <div className="mt-1">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`appearance-none block w-full px-3 py-2 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                } rounded-md focus:outline-none focus:z-10 sm:text-sm`}
              />
            </div>
            <PasswordStrengthMeter password={password} />
            <p
              className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Password must be between 8 and 32 characters long.
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !isPasswordValid}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading || !isPasswordValid
                ? "bg-gray-400 cursor-not-allowed"
                : darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Already have an account?{" "}
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
