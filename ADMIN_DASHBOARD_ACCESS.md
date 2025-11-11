# How to Access Admin Dashboard

## Step-by-Step Guide

### Step 1: Create an Admin User in Firebase

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Select your project

2. **Open Authentication**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"Users"** tab

3. **Add a New User**
   - Click **"Add user"** button
   - Enter an email (e.g., `admin@progym.com`)
   - Enter a password (make it strong!)
   - Click **"Add user"**
   - **IMPORTANT**: Copy the User UID that appears (you'll need this)

### Step 2: Set Admin Role in Firestore

1. **Go to Firestore Database**
   - Click on **"Firestore Database"** in the left sidebar
   - Click on **"Data"** tab

2. **Create User Document**
   - Click **"Start collection"** (if `users` collection doesn't exist)
   - Collection ID: `users`
   - Document ID: **Paste the User UID you copied earlier**
   - Click **"Next"**

3. **Add Fields**
   Add the following fields one by one:
   
   - Field: `displayName`
     - Type: `string`
     - Value: `Admin` (or your name)
   
   - Field: `email`
     - Type: `string`
     - Value: `admin@progym.com` (the email you used)
   
   - Field: `role`
     - Type: `string`
     - Value: `admin` (MUST be exactly "admin")
   
   - Field: `enrolledCategories`
     - Type: `array`
     - Value: Leave empty `[]` or add categories: `["fat-loss", "gain-muscle", "weight-gain"]`
   
   - Field: `createdAt`
     - Type: `string`
     - Value: Current date (e.g., `2024-01-01T00:00:00.000Z`)

4. **Click "Save"**

### Step 3: Access Admin Dashboard

1. **Login to the Website**
   - Go to your website (e.g., `http://localhost:3000` or your deployed URL)
   - Click **"Join Now"** or go to `/login`
   - Enter the admin email and password you created
   - Click **"Login"**

2. **Navigate to Admin Dashboard**
   - After logging in, you'll see **"Admin"** link in the navbar (top right)
   - Click on **"Admin"**
   - OR go directly to `/admin` URL

3. **You're In!**
   - You should now see the Admin Dashboard with three tabs:
     - **Users**: Manage users and grant access to services
     - **Videos**: Add and manage videos
     - **Programs**: Create and manage programs

## Admin Dashboard Features

### Users Tab
- View all registered users
- Grant/revoke access to service categories (Fat Loss, Gain Muscle, Weight Gain)
- Toggle access with checkmarks

### Videos Tab
- Add new videos by entering:
  - Video URL (YouTube, Vimeo, or any video hosting)
  - Thumbnail URL (optional)
  - Title, description, category, duration
- Delete videos
- View all videos

### Programs Tab
- Add new programs
- Delete programs
- Manage program details

## Troubleshooting

### "Admin" link doesn't appear in navbar
**Solution**: 
- Make sure the user document in Firestore has `role: "admin"` (exactly)
- Check that you're logged in with the admin account
- Refresh the page

### Can't access `/admin` page
**Solution**:
- Verify the user has `role: "admin"` in Firestore
- Check browser console for errors
- Make sure you're logged in

### Permission denied errors
**Solution**:
- Verify Firestore security rules are set correctly
- Check that the user document exists in Firestore
- Ensure `role` field is set to `"admin"` (lowercase)

## Quick Checklist

- [ ] Created admin user in Firebase Authentication
- [ ] Copied the User UID
- [ ] Created user document in Firestore with the UID as document ID
- [ ] Set `role` field to `"admin"`
- [ ] Set `email` field to admin email
- [ ] Set `displayName` field
- [ ] Logged in with admin credentials
- [ ] "Admin" link appears in navbar
- [ ] Can access `/admin` page

## Security Notes

⚠️ **Important**: 
- Never share admin credentials
- Use a strong password for admin account
- Regularly review who has admin access
- Consider using Firebase Authentication custom claims for better security (advanced)

## Example User Document Structure

```json
{
  "displayName": "Admin",
  "email": "admin@progym.com",
  "role": "admin",
  "enrolledCategories": [],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Verify Firestore rules allow reading user documents
3. Make sure the user is authenticated
4. Check that the role field is exactly `"admin"` (case-sensitive)

