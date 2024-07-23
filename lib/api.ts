import { TextData, TextResponse } from "@/types";
import Cookies from "js-cookie";

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

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to sign up");
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to sign in");
  }
  const result = await response.json();
  Cookies.set("token", result.authentication_token.token, {
    expires: new Date(result.authentication_token.expiry),
  });
}

export async function likeText(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/texts/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`, // Add this header if you're using token-based authentication
    },
  });
  if (!response.ok) {
    throw new Error("Failed to like text");
  }
}
