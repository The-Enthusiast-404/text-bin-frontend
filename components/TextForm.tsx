import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TextResponse } from "@/types";
import { languageOptions, EditorThemeName } from "@/lib/constants";
import {
  githubLight,
  githubDark,
  hackerBlue,
  ultraFocus,
  solarizedChroma,
  solarizedDark,
  solarizedLight,
} from "@/lib/editorThemes";
import Tooltip from "./Tooltip";
import { generateSalt, generateKey, encryptText } from "@/lib/encryption";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface TextFormProps {
  initialData: TextResponse["text"] | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  darkMode: boolean;
  highlightSyntax: boolean;
  editorTheme: EditorThemeName;
  isEditing?: boolean;
  onToggleSyntaxHighlighting: (enabled: boolean) => void;
  isPrivate?: boolean;
  isAuthenticated: boolean;
}

function TextForm({
  initialData,
  onSubmit,
  isLoading,
  darkMode,
  highlightSyntax,
  editorTheme,
  isEditing,
  onToggleSyntaxHighlighting,
  isPrivate = false,
  isAuthenticated,
}: TextFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [language, setLanguage] = useState(initialData?.format || "plaintext");
  const [expiryUnit, setExpiryUnit] = useState("days");
  const [expiryValue, setExpiryValue] = useState("1");
  const [isTextPrivate, setIsTextPrivate] = useState(isPrivate);
  const [password, setPassword] = useState("");

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        theme: darkMode ? "vs-dark" : "light",
      });
    }
  }, [darkMode]);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(
          model,
          highlightSyntax ? language : "plaintext",
        );
      }
    }
  }, [highlightSyntax, language]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const salt = generateSalt();
    const key = await generateKey(password, salt);

    // const encryptedTitle = await encryptText(title, key);
    const encryptedContent = await encryptText(
      editorRef.current ? editorRef.current.getValue() : content,
      key,
    );

    const encryptionSalt = btoa(
      String.fromCharCode.apply(null, Array.from(salt)),
    );

    onSubmit({
      title: title,
      content: encryptedContent,
      format: language,
      expiresUnit: expiryUnit,
      expiresValue: parseInt(expiryValue, 10),
      is_private: isTextPrivate,
      encryptionSalt: encryptionSalt,
    });
  };

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("github-light", githubLight);
    monaco.editor.defineTheme("github-dark", githubDark);
    monaco.editor.defineTheme("hacker-blue", hackerBlue);
    monaco.editor.defineTheme("ultra-focus", ultraFocus);
    monaco.editor.defineTheme("solarized-chroma", solarizedChroma);
    monaco.editor.defineTheme("solarized-dark", solarizedDark);
    monaco.editor.defineTheme("solarized-light", solarizedLight);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Title"
        className="text-sm sm:text-base md:text-lg lg:text-xl border border-gray-300 dark:border-gray-700"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        data-tooltip-id="title-tooltip"
      />
      <Tooltip id="title-tooltip" content="Enter a title for your text" />
      <div className="flex space-x-4">
        <Select value={expiryValue} onValueChange={setExpiryValue}>
          <SelectTrigger className="w-full border border-gray-300 dark:border-gray-700">
            <SelectValue placeholder="Expiry" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(31)].map((_, i) => (
              <SelectItem key={i} value={`${i + 1}`}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={expiryUnit} onValueChange={setExpiryUnit}>
          <SelectTrigger className="w-full border border-gray-300 dark:border-gray-700">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {[
              "seconds",
              "minutes",
              "hours",
              "days",
              "weeks",
              "months",
              "years",
            ].map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={language}
          onValueChange={(value) => {
            setLanguage(value);
            if (editorRef.current && monacoRef.current) {
              const model = editorRef.current.getModel();
              if (model) {
                monacoRef.current.editor.setModelLanguage(model, value);
              }
            }
          }}
        >
          <SelectTrigger className="w-full border border-gray-300 dark:border-gray-700">
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
      <div className="h-[300px] border border-gray-300 dark:border-gray-700">
        <MonacoEditor
          height="100%"
          language={highlightSyntax ? language : "plaintext"}
          value={content}
          theme={editorTheme}
          onChange={(value) => setContent(value || "")}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </div>

      <Input
        type="password"
        placeholder="Encryption Password"
        className="border border-gray-300 dark:border-gray-700"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        data-tooltip-id="password-tooltip"
      />
      <Tooltip
        id="password-tooltip"
        content="Enter a password to encrypt your text"
      />

      {isAuthenticated && (
        <div className="flex items-center space-x-2">
          <Switch
            id="private-mode"
            checked={isTextPrivate}
            onCheckedChange={setIsTextPrivate}
          />
          <Label htmlFor="private-mode" data-tooltip-id="private-mode-tooltip">
            Private
          </Label>
          <Tooltip
            id="private-mode-tooltip"
            content="Make this text visible only to you"
          />
        </div>
      )}
      <div className="flex justify-end">
        <Button
          className="text-xs sm:text-sm md:text-base transition ease-in-out py-1 transform hover:scale-105 hover:shadow-lg"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : initialData ? "Save" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default TextForm;
