import { createContext, useContext } from "react";
import type { AuthResponse } from "../types/auth";

export interface AuthContextValue {
  user: AuthResponse | null;
  login: (user: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth måste användas inuti AuthProvider");
  }
  return context;
}