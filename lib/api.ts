import { TextData, TextResponse } from "@/types";

const API_BASE_URL = "http://localhost:4000/v1";

export async function fetchText(slug: string): Promise<TextResponse> {
  const response = await fetch(`${API_BASE_URL}/texts/${slug}`);
  if (!response.ok) {
    throw new Error("Text not found");
  }
  return await response.json();
}

export async function submitText(data: TextData): Promise<TextResponse> {
  const response = await fetch(`${API_BASE_URL}/texts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to submit text");
  }
  return await response.json();
}

export async function updateText(
  slug: string,
  data: TextData,
): Promise<TextResponse> {
  const response = await fetch(`${API_BASE_URL}/texts/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update text");
  }
  return await response.json();
}

export async function deleteText(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/texts/${slug}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete text");
  }
}
