"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/api"; // Import the signIn function
import Cookies from "js-cookie";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await signIn(email, password);

      // After successful sign-in, store the email
      Cookies.set("userEmail", email, { expires: 7 }); // Store for 7 days
      localStorage.setItem("userEmail", email);

      console.log("Email stored in cookie:", Cookies.get("userEmail"));
      console.log(
        "Email stored in localStorage:",
        localStorage.getItem("userEmail"),
      );

      router.push("/");
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
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
