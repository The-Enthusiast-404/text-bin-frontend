"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextView from "./TextView";
import TextForm from "./TextForm";
import Header from "./Header";
import Footer from "./Footer";
import { TextResponse } from "@/types";
import { fetchText, submitText, updateText, deleteText } from "@/lib/api";

function HomeComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [darkMode, setDarkMode] = useState(false);
  const [highlightSyntax, setHighlightSyntax] = useState(false);
  const [text, setText] = useState<TextResponse["text"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const slug = searchParams.get("slug");
      if (typeof slug === "string") {
        fetchTextData(slug);
      }
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
      console.error("Error updating form:", error);
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

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        highlightSyntax={highlightSyntax}
        setHighlightSyntax={setHighlightSyntax}
      />
      <main className="flex-grow bg-background text-foreground p-8">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="p-4 border border-red-500 rounded-md text-red-500">
              {error}
            </div>
          ) : text ? (
            <TextView
              text={text}
              darkMode={darkMode}
              highlightSyntax={highlightSyntax}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
            />
          ) : null}

          {isEditing || !text ? (
            <TextForm
              initialData={isEditing ? text : null}
              onSubmit={isEditing ? handleUpdate : handleSubmit}
              isLoading={isLoading}
              darkMode={darkMode}
              highlightSyntax={highlightSyntax}
            />
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomeComponent;
