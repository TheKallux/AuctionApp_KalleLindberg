import { request } from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export function register(data: RegisterRequest) {
  return request<void>("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export function login(data: LoginRequest) {
  return request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) });
}