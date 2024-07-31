"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchText,
  submitText,
  updateText,
  deleteText,
  submitComment,
  likeText,
} from "@/lib/api";
import { TextResponse, TextData } from "@/types";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { FiPlus, FiUser, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";
import { EditorThemeName, editorThemes } from "@/lib/constants";

const DynamicTextView = dynamic(() => import("@/components/TextView"), {
  ssr: false,
});
const DynamicTextForm = dynamic(() => import("@/components/TextForm"), {
  ssr: false,
});

function HomeComponentContent() {
  const router = useRouter();
  const [editorTheme, setEditorTheme] =
    useState<EditorThemeName>("github-dark");
  const [darkMode, setDarkMode] = useState(true);
  const [highlightSyntax, setHighlightSyntax] = useState(true);
  const [text, setText] = useState<TextResponse["text"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
    const savedEditorTheme = localStorage.getItem(
      "editorTheme",
    ) as EditorThemeName | null;
    if (savedEditorTheme && editorThemes[savedEditorTheme]) {
      setEditorTheme(savedEditorTheme);
    } else {
      // Default to GitHub Dark if no theme is saved
      setEditorTheme("github-dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("editorTheme", editorTheme);
  }, [editorTheme]);

  const fetchTextData = async (slug: string) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await fetchText(slug);
      setText(result.text);
    } catch (error) {
      console.error("Error fetching text:", error);
      setError("Text not found or an error occurred while fetching.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: TextData) => {
    setIsLoading(true);
    setError("");
    try {
      // Ensure anonymous users can't create private texts
      if (!isAuthenticated && data.is_private) {
        throw new Error("Anonymous users cannot create private texts");
      }
      const result = await submitText(data);
      router.push(`/${result.text.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit text. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: TextData) => {
    if (!text) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await updateText(text.slug, data);
      setText(result.text);
      setIsEditing(false);
      router.push(`/${result.text.slug}`);
    } catch (error) {
      console.error("Error updating text:", error);
      setError("Failed to update text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!text) return;
    setIsLoading(true);
    setError("");
    try {
      await deleteText(text.slug);
      setText(null);
      router.push(`/`);
    } catch (error) {
      console.error("Error deleting text:", error);
      setError("Failed to delete text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    setIsAuthenticated(false);
    setText(null);
    router.push("/");
  };

  const handleComment = async (content: string) => {
    if (!text) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await submitComment(text.id, content);
      const updatedText = {
        ...text,
        comments: [...(text.comments || []), result.comment],
      };
      setText(updatedText);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!text) return;
    setIsLoading(true);
    setError("");
    try {
      await likeText(text.id);
      await fetchTextData(text.slug);
    } catch (error) {
      console.error("Error liking text:", error);
      setError("Failed to like text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSyntaxHighlighting = (enabled: boolean) => {
    setHighlightSyntax(enabled);
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
        <div className="flex justify-between mb-6">
          {!isAuthenticated ? (
            <>
              <Link href="/signin">
                <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  <FiLogIn className="mr-2" /> Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  <FiUserPlus className="mr-2" /> Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <button className="flex items-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  <FiUser className="mr-2" /> Profile
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                <FiLogOut className="mr-2" /> Sign Out
              </button>
            </>
          )}
        </div>
        {isLoading && <div className="text-center py-8">Loading...</div>}
        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded mb-4">
            {error}
          </div>
        )}
        {text && !isEditing ? (
          <DynamicTextView
            text={text}
            darkMode={darkMode}
            highlightSyntax={highlightSyntax}
            editorTheme={editorTheme}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAuthenticated={isAuthenticated}
            fetchText={fetchTextData}
            onComment={handleComment}
            onLike={handleLike}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiPlus className="mr-2" />{" "}
              {isEditing ? "Edit Paste" : "Create New Paste"}
            </h2>
            <DynamicTextForm
              initialData={isEditing ? text : null}
              onSubmit={isEditing ? handleUpdate : handleSubmit}
              isLoading={isLoading}
              darkMode={darkMode}
              highlightSyntax={highlightSyntax}
              editorTheme={editorTheme}
              onToggleSyntaxHighlighting={toggleSyntaxHighlighting}
              isPrivate={text?.is_private || false}
              isAuthenticated={isAuthenticated}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
export default function HomeComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponentContent />
    </Suspense>
  );
}
