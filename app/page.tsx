"use client";

import { useState } from "react";
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

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [highlightSyntax, setHighlightSyntax] = useState(false);
  const [language, setLanguage] = useState("plain");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      title,
      content,
      format: language,
      expiresUnit: unit,
      expiresValue: parseInt(duration, 10),
    };

    console.log("Submitting data:", data);

    try {
      const healthcheckResponse = await fetch(
        "https://textbin.theenthusiast.dev/v1/healthcheck",
      );
      if (!healthcheckResponse.ok) {
        throw new Error("Healthcheck network response was not ok");
      }
      const healthcheckResult = await healthcheckResponse.json();
      console.log("Healthcheck response:", healthcheckResult);

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
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Server response:", result);
      // You might want to show a success message to the user here
    } catch (error) {
      console.error("Error submitting form:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `https://textbin.theenthusiast.dev/v1/texts/${searchId}`,
      );

      if (!response.ok) {
        throw new Error("Text not found");
      }

      const result = await response.json();
      setSearchResult(result.text); // Access the 'text' property of the response
    } catch (error) {
      console.error("Error searching for text:", error);
      setSearchResult(null);
      setSearchError("Text not found or an error occurred while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const formatExpiryDate = (date) => {
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
          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Enter Text ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {searchResult && (
            <div className="mb-8 p-4 border rounded-md">
              <h2 className="text-2xl font-bold mb-2">{searchResult.title}</h2>
              <p className="mb-2">Format: {searchResult.format}</p>
              <p className="mb-2">
                Expires: {formatExpiryDate(searchResult.expires)}
              </p>
              {searchResult.format === "plain" ? (
                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                  {searchResult.content}
                </pre>
              ) : (
                <SyntaxHighlighter
                  language={searchResult.format}
                  style={darkMode ? atomDark : solarizedlight}
                  className="rounded-md"
                >
                  {searchResult.content}
                </SyntaxHighlighter>
              )}
            </div>
          )}
          {/* Search error */}
          {searchError && (
            <div className="mb-8 p-4 border border-red-500 rounded-md text-red-500">
              {searchError}
            </div>
          )}
          {/* Submission form */}
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
              <Button type="submit" size="lg">
                Submit
              </Button>
            </div>
          </form>
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
