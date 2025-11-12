# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name
4. Follow the setup wizard

## Step 2: Enable Authentication

1. Go to **Authentication** → **Get started**
2. Enable **Email/Password** provider
3. Click **Save**

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **Production mode**
4. Choose location
5. Click **Enable**

## Step 4: Set Firestore Rules

1. Go to **Firestore Database** → **Rules**
2. Copy rules from `firestore.rules` file
3. Paste and click **Publish**

## Step 5: Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Web** icon (</>)
4. Register app
5. Copy configuration

## Step 6: Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note**: Storage is NOT needed - you can upload files directly from your device (converted to base64) or use URLs!

## Step 7: Create Admin User

1. Go to **Authentication** → **Users** → **Add user**
2. Create user with email/password
3. Copy the **User UID**
4. Go to **Firestore Database**
5. Create document in `users` collection with UID as document ID
6. Add fields:
   ```json
   {
     "displayName": "Admin",
     "email": "admin@example.com",
     "role": "admin",
     "enrolledCategories": []
   }
   ```

## Step 8: Deploy Rules

1. Copy `firestore.rules` content
2. Paste in Firebase Console → Firestore → Rules
3. Click **Publish**

## Important Notes

- **No Storage Required**: This project does NOT use Firebase Storage (it's a paid service)
- **File Upload Support**: You can now upload videos and images directly from your device! Files are converted to base64 and stored in Firestore
- **URL Support**: You can still paste URLs for videos and images if you prefer
- **File Size Limits**: 
  - Images: Max 10MB
  - Videos: Max 50MB (stored as base64 in Firestore)
- **Free Tier Only**: Uses only Firebase Authentication and Firestore (both have free tiers)

## That's It!

Your Firebase is now configured and ready to use!

