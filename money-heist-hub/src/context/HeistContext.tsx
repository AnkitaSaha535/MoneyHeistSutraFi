import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loadUserData, saveUserData, loginUser, logoutUser, isUserAuthenticated, type UserData } from "@/lib/auth";

interface HeistContextType {
  userData: UserData;
  startHeist: () => void;
  incrementStreak: () => void;
  completeDailyTask: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userEmail: string | undefined;
}

const HeistContext = createContext<HeistContextType | null>(null);

export function HeistProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(loadUserData);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("sutrafi_theme");
    return (saved === "light" ? "light" : "dark");
  });

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sutrafi_theme", theme);
  }, [theme]);

  const startHeist = useCallback(() => setUserData((prev) => ({ ...prev, heist_started: true })), []);
  const incrementStreak = useCallback(() => setUserData((prev) => ({ ...prev, streak_days: prev.streak_days + 1 })), []);
  const completeDailyTask = useCallback(() => setUserData((prev) => ({ ...prev, daily_tasks: prev.daily_tasks + 1 })), []);
  const toggleTheme = useCallback(() => setTheme((p) => (p === "dark" ? "light" : "dark")), []);
  
  const login = useCallback((email: string) => {
    loginUser(email);
    setUserData(loadUserData());
  }, []);
  
  const logout = useCallback(() => {
    logoutUser();
    setUserData(loadUserData());
  }, []);

  const value: HeistContextType = {
    userData,
    startHeist,
    incrementStreak,
    completeDailyTask,
    theme,
    toggleTheme,
    login,
    logout,
    isAuthenticated: userData.isLoggedIn === true,
    userEmail: userData.email
  };

  return (
    <HeistContext.Provider value={value}>
      {children}
    </HeistContext.Provider>
  );
}

export function useHeist() {
  const ctx = useContext(HeistContext);
  if (!ctx) throw new Error("useHeist must be used within HeistProvider");
  return ctx;
}
