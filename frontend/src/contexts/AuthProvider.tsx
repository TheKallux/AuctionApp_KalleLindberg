import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthResponse } from "../types/auth";

const STORAGE_KEY = "auth";

function isExpired(token: string): boolean {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload));
    return exp * 1000 < Date.now();
}

function loadUser(): AuthResponse | null {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const user: AuthResponse = JSON.parse(saved);
    if (isExpired(user.token)) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
    return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(loadUser);

    function login(newUser: AuthResponse) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}