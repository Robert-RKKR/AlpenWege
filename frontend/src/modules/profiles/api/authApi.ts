// Application import:
import { apiClient } from "../../../services/api/client";
import type { AuthUser } from "../../../stores/authStore";

// Axios import:
import axios from "axios";

// Type definitions:
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export type LogoutPayload = {
  refresh: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
};

export type RegisterResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

// Login function:
export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await apiClient.post("/api/auth/login/", payload);
  return response.data.page_results;
}

// Logout function:
export async function logout(
  refresh: string
): Promise<void> {
  await apiClient.post("/api/auth/logout/", { refresh });
}

// Register function:
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const response = await apiClient.post(
    "/api/auth/registration/",
    payload
  );

  return response.data.page_results;
}

// Refresh token function:
export async function refreshToken(refresh: string): Promise<string> {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/token/refresh/`,
    { refresh },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.access;
}
