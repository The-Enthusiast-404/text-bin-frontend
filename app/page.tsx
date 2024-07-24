"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchText,
  submitText,
  updateText,
  deleteText,
  submitComment,
} from "@/lib/api";
import { TextResponse } from "@/types";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";

interface TextViewProps {
  text: TextResponse["text"];
  darkMode: boolean;
  highlightSyntax: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isAuthenticated: boolean;
  fetchText: (slug: string) => Promise<void>;
  onComment: (content: string) => Promise<void>;
}

interface TextFormProps {
  initialData: TextResponse["text"] | null;
  onSubmit: (data: {
    title: string;
    content: string;
    format: string;
    expiresUnit: string;
    expiresValue: number;
  }) => Promise<void>;
  isLoading: boolean;
  darkMode: boolean;
  highlightSyntax: boolean;
}

const DynamicTextView = dynamic<TextViewProps>(
  () => import("@/components/TextView").then((mod) => mod.default),
  { ssr: false },
);

const DynamicTextForm = dynamic<TextFormProps>(
  () => import("@/components/TextForm").then((mod) => mod.default),
  { ssr: false },
);

export default function HomeComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [darkMode, setDarkMode] = useState(false);
  const [highlightSyntax, setHighlightSyntax] = useState(false);
  const [text, setText] = useState<TextResponse["text"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const slug = searchParams.get("slug");
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
    if (typeof slug === "string") {
      fetchTextData(slug);
    }
  }, [searchParams]);

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

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await submitText(data);
      router.push(`/?slug=${result.text.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!text) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await updateText(text.slug, data);
      setText(result.text);
      setIsEditing(false);
      router.push(`/?slug=${result.text.slug}`);
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

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "dark" : ""}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        highlightSyntax={highlightSyntax}
        setHighlightSyntax={setHighlightSyntax}
      />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between mb-4">
          {!isAuthenticated ? (
            <>
              <Link href="/signin">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                  Profile
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {text && !isEditing ? (
          <DynamicTextView
            text={text}
            darkMode={darkMode}
            highlightSyntax={highlightSyntax}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAuthenticated={isAuthenticated}
            fetchText={fetchTextData}
            onComment={handleComment}
          />
        ) : (
          <DynamicTextForm
            initialData={isEditing ? text : null}
            onSubmit={isEditing ? handleUpdate : handleSubmit}
            isLoading={isLoading}
            darkMode={darkMode}
            highlightSyntax={highlightSyntax}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
