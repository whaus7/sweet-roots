# Sweet Roots Farm Demo Feature

## Overview

The Brix Logs page now includes a demo mode that shows sample data from "Sweet Roots Farm" when users are not logged in. This allows visitors to see how the Brix tracking system works before they sign up.

## Features

### Demo Mode for Non-Logged-In Users

- **Sweet Roots Farm Data**: Shows real Brix readings from a demo farm account
- **Explanatory Text**: Clear messaging about viewing demo data
- **Login Prompt**: Easy access to sign in and start tracking their own readings
- **Read-Only View**: Users can view data but cannot add/edit/delete readings in demo mode

### Full Functionality for Logged-In Users

- **Personal Data**: Users see their own Brix readings after logging in
- **Full CRUD Operations**: Add, edit, and delete readings
- **Plant Type Management**: Add new plant types and track multiple crops

## Technical Implementation

### User ID

- **Sweet Roots Farm User ID**: `a7e21794-c0aa-4933-84a6-0b03a41d8ef0`
- This is a master user account that serves as the demo data source

### Database Setup

To set up the Sweet Roots Farm demo data, run:

```bash
cd soil-dashboard-api
npm run setup-sweet-roots
```

This script will:

1. Create the Sweet Roots Farm user if it doesn't exist
2. Add sample Brix readings for various crops
3. Display a summary of the created data

### Sample Data Included

The demo includes readings for:

- **Spinach**: 2 readings showing improvement over time
- **Kale**: 2 readings with slight improvement
- **Carrots**: 2 readings showing soil amendment effects
- **Tomatoes**: 1 reading with excellent results
- **Bell Peppers**: 1 reading with good results

### Code Changes

#### Frontend (`app/brix-logs/page.tsx`)

- Added `SweetRootsFarmDemo` component for non-logged-in users
- Modified main component to load different data based on authentication status
- Added demo notice with login prompt and educational content

#### Backend (`soil-dashboard-api/create-sweet-roots-user.js`)

- Script to create demo user and sample data
- Ensures consistent demo experience across deployments

#### Component Updates (`app/components/BrixReadingCard.tsx`)

- Added `isDemo` prop to disable delete functionality in demo mode
- Maintains read-only experience for demo users

## User Experience

### For Non-Logged-In Users

1. Visit `/brix-logs` page
2. See Sweet Roots Farm demo notice with explanation
3. View sample Brix readings with charts and history
4. Click "Sign in with Google" to start tracking their own data
5. Option to learn more about Brix testing

### For Logged-In Users

1. Visit `/brix-logs` page
2. See their own Brix readings
3. Add new readings and manage plant types
4. Full editing and deletion capabilities

## Benefits

1. **User Onboarding**: Visitors can understand the value before signing up
2. **Feature Demonstration**: Shows the full capabilities of the system
3. **Educational**: Provides real examples of Brix readings and their interpretation
4. **Conversion**: Encourages sign-ups by showing the potential benefits

## Future Enhancements

- Add more diverse sample data
- Include seasonal variations in readings
- Show different farming practices and their effects
- Add educational tooltips explaining Brix values
- Include success stories and case studies
