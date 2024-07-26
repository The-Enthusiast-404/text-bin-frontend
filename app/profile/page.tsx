"use client";
import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "@/lib/api";
import { UserProfile, TextResponse, Comment } from "@/types";
import Cookies from "js-cookie";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiEdit,
  FiFileText,
} from "react-icons/fi";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("texts");

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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "texts"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("texts")}
          >
            <FiFileText className="inline-block mr-2" />
            Texts
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "comments"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            <FiMessageSquare className="inline-block mr-2" />
            Comments
          </button>
        </div>

        <div className="p-6">
          {activeTab === "texts" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Texts</h2>
              {profile.texts && profile.texts.length > 0 ? (
                <ul className="space-y-4">
                  {profile.texts.map((textResponse: any, index: number) => (
                    <li key={index} className="border-b pb-4">
                      <h3 className="text-xl font-semibold">
                        {textResponse?.title ||
                          textResponse?.text?.title ||
                          "Untitled"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {(
                          textResponse?.content ||
                          textResponse?.text?.content ||
                          ""
                        ).length > 100
                          ? `${(textResponse?.content || textResponse?.text?.content || "").substring(0, 100)}...`
                          : textResponse?.content ||
                            textResponse?.text?.content ||
                            ""}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FiEdit className="mr-1" />
                        <span>
                          {textResponse?.format ||
                            textResponse?.text?.format ||
                            "Unknown"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          Expires:{" "}
                          {new Date(
                            textResponse?.expires ||
                              textResponse?.text?.expires ||
                              Date.now(),
                          ).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {textResponse?.likes_count ||
                            textResponse?.text?.likes_count ||
                            0}{" "}
                          likes
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No texts available
                </p>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              {profile.comments && profile.comments.length > 0 ? (
                <ul className="space-y-4">
                  {profile.comments.map((comment: Comment) => (
                    <li key={comment.id} className="border-b pb-4">
                      <p className="text-gray-800 dark:text-gray-200">
                        {comment.content}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FiMessageSquare className="mr-1" />
                        <span>
                          Commented on{" "}
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Text ID: {comment.text_id}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No comments available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
