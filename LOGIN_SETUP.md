# Login System Setup Guide

## Overview

The soil dashboard now includes a user authentication system using Google OAuth. Users can sign in with their Google accounts to track their own Brix readings.

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/soil_dashboard

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
NEXT_PUBLIC_API_DOMAIN=your-api-domain.vercel.app

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
5. Set the authorized JavaScript origins to:
   - `http://localhost:3000` (for development)
   - `https://your-domain.vercel.app` (for production)
6. Copy the Client ID and set it as `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in your environment variables

## Database Changes

The database has been updated with the following changes:

1. **Users Table**: Stores user information from Google OAuth

   - `id`: UUID primary key
   - `email`: User's email address
   - `name`: User's display name
   - `provider`: OAuth provider (e.g., "google")
   - `provider_id`: Provider's unique user ID
   - `avatar_url`: User's profile picture URL

2. **Brix Readings Table**: Updated to include user association
   - Added `user_id` field that references the users table
   - All Brix readings are now associated with a specific user

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - Handle social login
- `GET /api/auth/user/:id` - Get user by ID
- `GET /api/auth/user/provider/:provider/:providerId` - Get user by provider

### Updated Brix Endpoints

- `GET /api/brix/readings?user_id=...` - Get user's Brix readings
- `POST /api/brix/readings` - Create Brix reading (requires user_id)
- `GET /api/brix/stats?user_id=...` - Get user's statistics

## Frontend Changes

1. **User Context**: Manages authentication state across the app
2. **Protected Routes**: Brix logs page now requires authentication
3. **Login Component**: Google OAuth login interface
4. **Header Updates**: Shows user info and logout button

## Features

- ✅ Google OAuth login
- ✅ User-specific Brix readings
- ✅ Persistent login state
- ✅ Protected routes
- ✅ User profile display
- ✅ Logout functionality

## Usage

1. Users visit the Brix Logs page
2. If not logged in, they see the login screen
3. After logging in with Google, they can access their personal Brix readings
4. All Brix readings are now associated with their user account
5. Users can log out using the button in the header

## Security Notes

- User data is stored securely in the database
- OAuth tokens are not stored, only user profile information
- All API endpoints validate user authentication
- CORS is properly configured for security
