import {
  TextData,
  TextResponse,
  CommentResponse,
  UserProfileResponse,
} from "@/types";
import Cookies from "js-cookie";

const API_BASE_URL = "https://textbin.theenthusiast.dev/v1";

export async function fetchText(slug: string): Promise<TextResponse> {
  const token = Cookies.get("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/texts/${slug}`, {
    headers: headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Text not found");
    }
    throw new Error("Failed to fetch text");
  }
  return await response.json();
}

export async function submitText(data: TextData): Promise<TextResponse> {
  const token = Cookies.get("token");
  const isAuthenticated = !!token;

  // Ensure anonymous users can't create private texts
  if (!isAuthenticated && data.is_private) {
    throw new Error("Anonymous users cannot create private texts");
  }

  const response = await fetch(`${API_BASE_URL}/texts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(isAuthenticated && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      ...data,
      is_private: isAuthenticated ? data.is_private : false,
    }),
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
  const token = Cookies.get("token");
  const isAuthenticated = !!token;

  // Ensure anonymous users can't update texts to be private
  if (!isAuthenticated && data.is_private) {
    throw new Error("Anonymous users cannot create private texts");
  }

  const response = await fetch(`${API_BASE_URL}/texts/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(isAuthenticated && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      ...data,
      is_private: isAuthenticated ? data.is_private : false,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update text");
  }
  return await response.json();
}

export async function deleteText(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/texts/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
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
  try {
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
    const token = result.authentication_token.token;
    const tokenExpiry = new Date(result.authentication_token.expiry);
    const emailExpiry = 7; // Store the email for 7 days
    // Store the token in cookies
    Cookies.set("token", token, { expires: tokenExpiry });
    console.log("Token set in cookie:", Cookies.get("token"));
    // Store the email in both localStorage and a cookie
    localStorage.setItem("userEmail", email);
    Cookies.set("userEmail", email, { expires: emailExpiry });
    console.log(
      "Email set in localStorage:",
      localStorage.getItem("userEmail"),
    );
    console.log("Email set in cookie:", Cookies.get("userEmail"));
    console.log("Sign-in successful, token and email stored.");
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error; // Re-throw the error so it can be caught by the component
  }
}

export async function likeText(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/texts/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to like text");
  }
}

export async function submitComment(
  textId: number,
  content: string,
): Promise<CommentResponse> {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("User not authenticated");
  }
  const response = await fetch(`${API_BASE_URL}/texts/${textId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit comment");
  }
  return await response.json();
}

export async function fetchUserProfile(
  email: string,
): Promise<UserProfileResponse> {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("User not authenticated");
  }
  const response = await fetch(`${API_BASE_URL}/users/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return await response.json();
}

export async function requestPasswordReset(
  email: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/tokens/password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error("Failed to request password reset");
  }
  return await response.json();
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/users/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to reset password");
  }
  return await response.json();
}

export async function deleteAccount(
  userId: number,
): Promise<{ message: string }> {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("User not authenticated");
  }
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("You do not have permission to delete this account");
    }
    throw new Error("Failed to delete account");
  }
  return await response.json();
}
