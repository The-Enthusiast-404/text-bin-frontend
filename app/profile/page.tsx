"use client";

import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/lib/api";
import { UserProfile } from "@/types";
import Cookies from "js-cookie";

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

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="mb-4">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(profile.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Account Status:</strong>{" "}
          {profile.activated ? "Activated" : "Not Activated"}
        </p>
      </div>
    </div>
  );
}
