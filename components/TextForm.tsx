"use client";

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
import { TextResponse } from "@/types";
import { languageOptions } from "@/lib/constants";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface TextFormProps {
  initialData: TextResponse["text"] | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  darkMode: boolean;
  highlightSyntax: boolean;
  isEditing?: boolean;
  onToggleSyntaxHighlighting: (enabled: boolean) => void;
}

function TextForm({
  initialData,
  onSubmit,
  isLoading,
  darkMode,
  highlightSyntax,
  isEditing,
  onToggleSyntaxHighlighting,
}: TextFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [language, setLanguage] = useState(initialData?.format || "plaintext");
  const [expiryUnit, setExpiryUnit] = useState("days");
  const [expiryValue, setExpiryValue] = useState("1");
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      title,
      content: editorRef.current ? editorRef.current.getValue() : content,
      format: language,
      expiresUnit: expiryUnit,
      expiresValue: parseInt(expiryValue, 10),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Title"
        className="text-xl border border-gray-300 dark:border-gray-700"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
          theme={darkMode ? "vs-dark" : "light"}
          onChange={(value) => setContent(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Submitting..." : initialData ? "Save" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default TextForm;
