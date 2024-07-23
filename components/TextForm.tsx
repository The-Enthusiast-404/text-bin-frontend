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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { TextResponse } from "@/types";
import { languageOptions } from "@/lib/constants";

interface TextFormProps {
  initialData: TextResponse["text"] | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  darkMode: boolean;
  highlightSyntax: boolean;
}

function TextForm({
  initialData,
  onSubmit,
  isLoading,
  darkMode,
  highlightSyntax,
}: TextFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [language, setLanguage] = useState(initialData?.format || "plain");
  const [unit, setUnit] = useState("days");
  const [duration, setDuration] = useState("1");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      title,
      content,
      format: language,
      expiresUnit: unit,
      expiresValue: parseInt(duration, 10),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Title"
        className="text-xl"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
            {["seconds", "minutes", "days", "weeks", "months", "years"].map(
              (unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ),
            )}
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
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Submitting..." : initialData ? "Save" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default TextForm;
