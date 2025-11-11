# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Firebase account

## Steps to Get Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Storage
5. Copy your Firebase config from Project Settings

### 3. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Set Firebase Security Rules

1. Go to Firestore Database > Rules
2. Copy contents from `firestore.rules`
3. Paste and publish

4. Go to Storage > Rules
5. Copy contents from `storage.rules`
6. Paste and publish

### 5. Create Admin User

1. Go to Authentication > Users
2. Add a new user (email/password)
3. Copy the User UID
4. Go to Firestore Database
5. Create a document in `users` collection with the UID as document ID
6. Add fields:
   - `displayName`: "Admin"
   - `email`: "admin@example.com"
   - `role`: "admin"
   - `enrolledCategories`: []

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Testing

### Test as Regular User
1. Sign up with a new email
2. Complete your profile
3. Browse services (you'll need admin to grant access)

### Test as Admin
1. Login with admin credentials
2. Go to Admin Dashboard
3. Grant access to users
4. Upload videos
5. Manage programs

## Troubleshooting

### Firebase Not Initialized Error
- Check that all environment variables are set correctly
- Verify Firebase project is active
- Check browser console for detailed errors

### Authentication Issues
- Ensure Email/Password provider is enabled in Firebase
- Check Firestore rules allow user creation
- Verify user document is created in Firestore

### Storage Upload Errors
- Check Storage rules are set correctly
- Verify file size limits
- Ensure user has proper permissions

## Next Steps

1. Add initial programs via Admin Dashboard
2. Upload sample videos
3. Grant access to test users
4. Customize styling and content
5. Deploy to production

For detailed instructions, see README.md

