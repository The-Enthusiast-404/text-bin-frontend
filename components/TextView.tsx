import React, { useState } from "react";
import { TextResponse, Comment } from "@/types";

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

const TextView: React.FC<TextViewProps> = ({
  text,
  darkMode,
  highlightSyntax,
  onEdit,
  onDelete,
  isAuthenticated,
  fetchText,
  onComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div
      className={`p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
    >
      <h1 className="text-2xl font-bold mb-4">{text.title}</h1>
      <pre
        className={`whitespace-pre-wrap ${highlightSyntax ? "bg-gray-100 p-2 rounded" : ""}`}
      >
        {text.content}
      </pre>
      {isAuthenticated && (
        <div className="mt-4">
          <button
            onClick={onEdit}
            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {text.comments && text.comments.length > 0 ? (
          text.comments.map((comment: Comment) => (
            <div key={comment.id} className="mb-4 p-2 bg-gray-100 rounded">
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
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default TextView;
