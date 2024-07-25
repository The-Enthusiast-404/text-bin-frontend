"use client";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/lib/api";
import { UserProfile } from "@/types";
import Cookies from "js-cookie";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const email = Cookies.get("userEmail");
      if (!email) {
        setError("User email not found");
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchUserProfile(email);
        setProfile(data.user);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded m-4">
        Error: {error}
      </div>
    );
  if (!profile)
    return <div className="text-center p-4">No profile data available</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-4">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              @{profile.name.toLowerCase().replace(/\s/g, "")}
            </p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <FiMail className="mr-2 text-gray-500" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-gray-500" />
            <span>
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            {profile.activated ? (
              <FiCheckCircle className="mr-2 text-green-500" />
            ) : (
              <FiXCircle className="mr-2 text-red-500" />
            )}
            <span>{profile.activated ? "Activated" : "Not Activated"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">User Activity</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This user's texts and comments are not available through the current
          API. Check back later for updates on user activity features.
        </p>
      </div>
    </div>
  );
}
