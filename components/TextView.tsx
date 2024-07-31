// TextView.tsx
import React, { useState } from "react";
import { TextResponse, Comment } from "@/types";
import {
  FiEdit,
  FiTrash2,
  FiMessageSquare,
  FiThumbsUp,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { EditorThemeName } from "@/lib/constants";

interface TextViewProps {
  text: TextResponse["text"];
  darkMode: boolean;
  highlightSyntax: boolean;
  editorTheme: EditorThemeName;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isAuthenticated: boolean;
  fetchText: (slug: string) => Promise<void>;
  onComment: (content: string) => Promise<void>;
  onLike: () => Promise<void>;
}

const TextView: React.FC<TextViewProps> = ({
  text,
  darkMode,
  highlightSyntax,
  editorTheme,
  onEdit,
  onDelete,
  isAuthenticated,
  fetchText,
  onComment,
  onLike,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(newComment.trim());
      setNewComment("");
    }
  };

  const getLanguage = (format: string) => {
    return format === "plain" ? "text" : format;
  };

  const getSyntaxHighlighterTheme = () => {
    switch (editorTheme) {
      case "vs-dark":
      case "hc-black":
      case "github-dark":
        return tomorrow;
      case "vs":
      case "hc-light":
      case "github-light":
        return vs;
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{text.title}</h1>
        {text.is_private ? (
          <div className="flex items-center text-yellow-500">
            <FiLock className="mr-1" />
            Private
          </div>
        ) : (
          <div className="flex items-center text-green-500">
            <FiUnlock className="mr-1" />
            Public
          </div>
        )}
      </div>
      <div className="relative rounded-md overflow-hidden">
        {highlightSyntax ? (
          <SyntaxHighlighter
            language={getLanguage(text.format || "text")}
            style={getSyntaxHighlighterTheme()}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: darkMode ? "#2d3748" : "#f7fafc",
            }}
          >
            {text.content}
          </SyntaxHighlighter>
        ) : (
          <pre className="whitespace-pre-wrap p-4">{text.content}</pre>
        )}
      </div>
      <div className="mt-6 flex items-center space-x-4">
        <button
          onClick={onLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } transition duration-300`}
          disabled={!isAuthenticated}
        >
          <FiThumbsUp className="mr-2" />
          <span>Like</span>
        </button>
        <span className="text-lg font-semibold">
          {text.likes_count} {text.likes_count === 1 ? "Like" : "Likes"}
        </span>
        {isAuthenticated && (
          <>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            >
              <FiEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300"
            >
              <FiTrash2 />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FiMessageSquare className="mr-2" />
          Comments ({text.comments?.length || 0})
        </h2>
        {text.comments && text.comments.length > 0 ? (
          text.comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className={`mb-4 p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p>{comment.content}</p>
              <small className="text-gray-500">
                Posted on: {new Date(comment.created_at).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-3 border rounded-lg ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
            }`}
            placeholder="Add a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
          >
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default TextView;
