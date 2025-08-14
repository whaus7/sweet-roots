"use client";
import React, { useState, useEffect } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { authApi, User, LoginData } from "../services/authApi";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onLoginError: (error: string) => void;
}

export default function Login({ onLoginSuccess, onLoginError }: LoginProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      // Check if credential exists
      if (!credentialResponse.credential) {
        onLoginError("No credential received from Google");
        return;
      }

      // Decode the JWT token to get user information
      const decoded = JSON.parse(
        atob(credentialResponse.credential.split(".")[1])
      );

      const { email, name, picture, sub } = decoded;

      const loginData: LoginData = {
        email,
        name,
        provider: "google",
        providerId: sub,
        avatarUrl: picture,
      };

      const result = await authApi.login(loginData);

      if (result.success) {
        onLoginSuccess(result.data.user);
      } else {
        onLoginError("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      onLoginError("Login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.error("Google login error");
    onLoginError("Google login failed. Please try again.");
  };

  // Get Google Client ID from environment variables
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.warn(
      "Google Client ID not found. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable."
    );
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Google Client ID not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Soil Dashboard
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to track your Brix readings and monitor your soil health
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-4">
            {isClient && (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our terms of service and privacy
                policy
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Track your soil health and Brix readings with ease
          </p>
        </div>
      </div>
    </div>
  );
}
