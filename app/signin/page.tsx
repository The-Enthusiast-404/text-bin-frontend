"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/api";
import Cookies from "js-cookie";
import AuthLayout from "@/components/AuthLayout";
import { FiMail, FiLogIn } from "react-icons/fi";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await signIn(email, password);
      Cookies.set("userEmail", email, { expires: 7 });
      localStorage.setItem("userEmail", email);
      router.replace("/");
    } catch (error) {
      console.error("Error signing in:", error);
      setError(
        "Failed to sign in. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <h2
        className={`mt-6 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        Welcome Back
      </h2>
      <p
        className={`mt-2 text-center text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        Sign in to your account
      </p>
      {error && (
        <div className="mt-4 text-red-500 text-center bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
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
                  className={`h-4 md:h-5 md:w-5 w-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
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
                } rounded-md focus:outline-none focus:z-10 text-sm md:text-base`}
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
                placeholder="Password (8-32 characters)"
                className={`appearance-none block w-full px-3 py-2 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                } rounded-md focus:outline-none focus:z-10 text-sm md:text-base`}
              />
            </div>
          </div>
        </div>

        <div className="mr-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:scale-105 hover:shadow-lg duration-150 ease-in-out`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FiLogIn
                className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-500"} group-hover:text-blue-400`}
              />
            </span>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p
          className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className={`font-medium ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
          >
            Sign up here
          </Link>
        </p>
        <p
          className={`text-xs md:text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Forgot your password?{" "}
          <Link
            href="/request-password-reset"
            className={`font-medium ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
          >
            Reset it here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
