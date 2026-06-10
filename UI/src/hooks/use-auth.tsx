import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const USER_KEY = "user";

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(
      "Empty response from server. Start the API with `npm run dev` or `npm run dev:all` and ensure MongoDB is running."
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      "Invalid response from server. Use `npm run dev:all` so the API runs on port 5000."
    );
  }
}

function persistSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser) as User);
      }
    } catch {
      clearSession();
    }
    setIsLoading(false);
  }, []);

  const applySession = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    persistSession(newToken, newUser);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await parseJsonResponse<{
        token: string;
        user: User;
        message?: string;
      }>(res);

      if (!res.ok) {
        throw new Error(data.message || "Invalid username or password");
      }

      applySession(data.token, data.user);

      toast({
        title: "Welcome back!",
        description: `Signed in as ${data.user.username}.`,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await parseJsonResponse<{
        token: string;
        user: User;
        message?: string;
      }>(res);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      applySession(data.token, data.user);

      toast({
        title: "Account created!",
        description: `Welcome, ${data.user.username}! You are now signed in.`,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearSession();
    toast({
      title: "Signed out",
      description: "You have been logged out successfully.",
    });
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
