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
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <FiUser className="mr-4 text-2xl text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-semibold">{profile.name}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiMail className="mr-4 text-2xl text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-semibold">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-4 text-2xl text-purple-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
              <p className="font-semibold">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {profile.activated ? (
              <FiCheckCircle className="mr-4 text-2xl text-green-500" />
            ) : (
              <FiXCircle className="mr-4 text-2xl text-red-500" />
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Account Status
              </p>
              <p className="font-semibold">
                {profile.activated ? "Activated" : "Not Activated"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
