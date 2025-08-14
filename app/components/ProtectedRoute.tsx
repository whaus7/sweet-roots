"use client";
import React from "react";
import { useUser } from "../contexts/UserContext";
import Login from "./Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, login } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Login
        onLoginSuccess={login}
        onLoginError={(error) => console.error(error)}
      />
    );
  }

  return <>{children}</>;
}
