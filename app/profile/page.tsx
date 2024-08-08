"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserProfile, deleteAccount } from "@/lib/api";
import { UserProfile, TextResponse, Comment } from "@/types";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiEdit,
  FiFileText,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EditorThemeName } from "@/lib/constants";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("texts");
  const [darkMode, setDarkMode] = useState(false);
  const [highlightSyntax, setHighlightSyntax] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editorTheme, setEditorTheme] = useState<EditorThemeName>("vs-dark");
  const router = useRouter();

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
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if (!profile) {
      setError("Profile data not available");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount(profile.id);
      Cookies.remove("token");
      Cookies.remove("userEmail");
      localStorage.removeItem("userEmail");
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete account. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        highlightSyntax={highlightSyntax}
        setHighlightSyntax={setHighlightSyntax}
        editorTheme={editorTheme}
        setEditorTheme={setEditorTheme}
      />
      <main className="flex-grow container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            Loading profile...
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-100 p-4 rounded m-4">
            Error: {error}
          </div>
        ) : !profile ? (
          <div className="text-center p-4">No profile data available</div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div
              className={`rounded-lg shadow-md p-6 mb-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-4">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
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
                  <span>
                    {profile.activated ? "Activated" : "Not Activated"}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`rounded-lg shadow-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === "texts"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : darkMode
                        ? "text-gray-400"
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
                      : darkMode
                        ? "text-gray-400"
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
                        {profile.texts.map(
                          (textResponse: TextResponse | any, index: number) => {
                            // Handle both possible structures
                            const text = textResponse.text || textResponse;
                            const slug = text?.slug || textResponse?.slug;

                            if (!text) return null; // Skip if no valid text object

                            return (
                              <li
                                key={index}
                                className={`border-b pb-4 ${
                                  darkMode
                                    ? "border-gray-700"
                                    : "border-gray-200"
                                }`}
                              >
                                <Link
                                  href={slug ? `/${slug}` : "#"}
                                  className="block hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out rounded-lg p-3"
                                >
                                  <h3 className="text-xl font-semibold flex items-center">
                                    {text.title || "Untitled"}
                                    <FiExternalLink className="ml-2 text-blue-500" />
                                  </h3>
                                  <p
                                    className={`mt-2 overflow-x-auto ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {text.content && text.content.length > 100
                                      ? `${text.content.substring(0, 100)}...`
                                      : text.content || "No content available"}
                                  </p>
                                  <div
                                    className={`flex items-center mt-2 text-sm ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    <FiEdit className="mr-1" />
                                    <span>
                                      {text.format || "Unknown format"}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>
                                      Expires:{" "}
                                      {text.expires
                                        ? new Date(
                                            text.expires,
                                          ).toLocaleDateString()
                                        : "Not set"}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>{text.likes_count || 0} likes</span>
                                  </div>
                                </Link>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    ) : (
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
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
                          <li
                            key={comment.id}
                            className={`border-b pb-4 ${
                              darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <p
                              className={
                                darkMode ? "text-gray-200" : "text-gray-800"
                              }
                            >
                              {comment.content}
                            </p>
                            <div
                              className={`flex items-center mt-2 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <FiMessageSquare className="mr-1" />
                              <span>
                                Commented on{" "}
                                {new Date(
                                  comment.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        No comments available
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Delete Account Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Account Actions</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center ease-in-out transform hover:scale-105 hover:shadow-lg">
                    <FiTrash2 className="mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all of your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="ease-in-out transform hover:scale-105 hover:shadow-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="ease-in-out transform hover:scale-105 hover:shadow-lg"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Yes, delete my account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
