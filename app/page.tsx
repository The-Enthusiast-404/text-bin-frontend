"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const languageOptions = [
  "plain",
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "swift",
  "kotlin",
  "ruby",
  "php",
  "html",
  "css",
  "sql",
  "bash",
  "yaml",
  "json",
];

interface TextData {
  title: string;
  content: string;
  format: string;
  expiresUnit: string;
  expiresValue: number;
}

interface TextResponse {
  text: {
    title: string;
    content: string;
    format: string;
    expires: string; // Assuming expires is a string date for formatting
    slug: string;
  };
}

export default function Home() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [highlightSyntax, setHighlightSyntax] = useState(false);
  const [language, setLanguage] = useState("plain");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("");
  const [text, setText] = useState<TextResponse["text"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { slug } = router.query;
    if (typeof slug === "string") {
      fetchText(slug);
    }
  }, [router.query]);

  const fetchText = async (slug: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://textbin.theenthusiast.dev/v1/texts/${slug}`,
      );
      if (!response.ok) {
        throw new Error("Text not found");
      }
      const result: TextResponse = await response.json();
      setText(result.text);
    } catch (error) {
      console.error("Error fetching text:", error);
      setError("Text not found or an error occurred while fetching.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const data: TextData = {
      title,
      content,
      format: language,
      expiresUnit: unit,
      expiresValue: parseInt(duration, 10),
    };

    try {
      const response = await fetch(
        "https://textbin.theenthusiast.dev/v1/texts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit text");
      }

      const result: TextResponse = await response.json();
      router.push(`/?slug=${result.text.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatExpiryDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">TEXT BIN</h1>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                id="dark-mode"
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
              />
              <Label htmlFor="dark-mode">
                {darkMode ? "Dark Mode" : "Light Mode"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={highlightSyntax}
                onCheckedChange={setHighlightSyntax}
                id="highlight-syntax"
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
              />
              <Label htmlFor="highlight-syntax">Syntax Highlighting</Label>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-background text-foreground p-8">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="p-4 border border-red-500 rounded-md text-red-500">
              {error}
            </div>
          ) : text ? (
            <div className="mb-8 p-4 border rounded-md">
              <h2 className="text-2xl font-bold mb-2">{text.title}</h2>
              <p className="mb-2">Format: {text.format}</p>
              <p className="mb-2">Expires: {formatExpiryDate(text.expires)}</p>
              {text.format === "plain" ? (
                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                  {text.content}
                </pre>
              ) : (
                <SyntaxHighlighter
                  language={text.format}
                  style={darkMode ? atomDark : solarizedlight}
                  className="rounded-md"
                >
                  {text.content}
                </SyntaxHighlighter>
              )}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  type="text"
                  placeholder="Title"
                  className="text-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(31)].map((_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "seconds",
                      "minutes",
                      "days",
                      "weeks",
                      "months",
                      "years",
                    ].map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                {highlightSyntax && language !== "plain" ? (
                  <SyntaxHighlighter
                    language={language}
                    style={darkMode ? atomDark : solarizedlight}
                    className="h-[300px] p-4 rounded-md overflow-auto"
                  >
                    {content}
                  </SyntaxHighlighter>
                ) : (
                  <Textarea
                    placeholder="Paste the text here..."
                    className="min-h-[300px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-secondary text-secondary-foreground p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 The Enthusiast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
