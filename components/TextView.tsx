import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { likeText } from "@/lib/api";
import { TextResponse } from "@/types";

interface TextViewProps {
  text: TextResponse["text"];
  darkMode: boolean;
  highlightSyntax: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isAuthenticated: boolean;
  fetchText: (slug: string) => Promise<void>;
}

const TextView: React.FC<TextViewProps> = ({
  text,
  darkMode,
  highlightSyntax,
  onEdit,
  onDelete,
  isAuthenticated,
  fetchText,
}) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setIsLiking(true);
    try {
      await likeText(text.id);
      fetchText(text.slug);
    } catch (error) {
      console.error("Error liking text:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(text.content);
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(text.title);
  };

  const formatExpiryDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="mb-8 p-4 border rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <div className="space-x-2">
          <Button onClick={handleCopyTitle}>Copy Title</Button>
          <Button onClick={handleCopyContent}>Copy Content</Button>
          {isAuthenticated && (
            <Button
              onClick={handleLike}
              disabled={isLiking}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
            >
              {isLiking ? "Liking..." : `Like (${text.likes_count})`}
            </Button>
          )}
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={onDelete} variant="destructive">
            Delete
          </Button>
        </div>
      </div>
      <div className="text-gray-500 mb-4">
        Expires at: {formatExpiryDate(text.expires)}
      </div>
      {highlightSyntax ? (
        <SyntaxHighlighter
          language={text.format}
          style={darkMode ? atomDark : solarizedlight}
          className="whitespace-pre-wrap p-4 rounded-md"
        >
          {text.content}
        </SyntaxHighlighter>
      ) : (
        <pre
          className={`whitespace-pre-wrap p-4 rounded-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          {text.content}
        </pre>
      )}
    </div>
  );
};

export default TextView;
