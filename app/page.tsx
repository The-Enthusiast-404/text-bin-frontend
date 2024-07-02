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
          <form className="space-y-6">
            <div>
              <Input type="text" placeholder="Title" className="text-xl" />
            </div>
            <div className="flex space-x-4">
              <Select>
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
              <Select>
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
