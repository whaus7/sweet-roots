"use client";
import React from "react";
import Login from "../components/Login";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/navigation";
import { User } from "../services/authApi";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();

  const handleLoginSuccess = (user: User) => {
    login(user);
    // Redirect to dashboard after successful login
    router.push("/");
  };

  const handleLoginError = (error: string) => {
    // You could add a toast notification here if needed
    console.error("Login error:", error);
  };

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onLoginError={handleLoginError}
    />
  );
}
