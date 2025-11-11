# Firebase Security Rules Setup - Step by Step Guide

## Part 1: Setting Up Firestore Security Rules

### Step 1: Open Firebase Console
1. Go to **https://console.firebase.google.com/**
2. Sign in with your Google account
3. Click on your project (or create a new one if you haven't)

### Step 2: Navigate to Firestore Database
1. In the left sidebar, look for **"Build"** section
2. Click on **"Firestore Database"**
   - If you see "Create database" button, click it first:
     - Select **"Start in production mode"** (or test mode for development)
     - Choose a location (select the closest to your users)
     - Click **"Enable"**
     - Wait for the database to be created

### Step 3: Open the Rules Tab
1. At the top of the Firestore Database page, you'll see tabs: **"Data"**, **"Rules"**, **"Indexes"**, **"Usage"**
2. Click on the **"Rules"** tab

### Step 4: View Current Rules
- You'll see the default rules (usually something like):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if false;
      }
    }
  }
  ```

### Step 5: Delete the Default Rules
1. Select all the text in the rules editor (Ctrl+A or Cmd+A)
2. Delete it (press Delete or Backspace)

### Step 6: Copy Firestore Rules from Your Project
1. Open the file `firestore.rules` from your project folder
2. Select all the content (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 7: Paste into Firebase Console
1. Click in the empty rules editor in Firebase Console
2. Paste the rules (Ctrl+V or Cmd+V)
3. You should see the complete rules with:
   - Helper functions (isAuthenticated, isAdmin, isOwner)
   - Users collection rules
   - Programs collection rules
   - Videos collection rules
   - Purchases collection rules
   - Roles collection rules

### Step 8: Validate the Rules
1. Firebase will automatically validate the rules
2. Look for any red error messages
3. If you see errors, check:
   - All brackets are closed `{}`
   - All quotes are properly closed
   - No typos in function names

### Step 9: Publish the Rules
1. Click the **"Publish"** button at the top right
2. A confirmation dialog will appear
3. Click **"Publish"** to confirm
4. Wait for the rules to be published (you'll see a success message)

### Step 10: Verify Rules are Published
- You should see a message: "Rules published successfully"
- The rules are now active

---

## Part 2: Setting Up Storage Security Rules

### Step 1: Navigate to Storage
1. In the left sidebar, look for **"Build"** section
2. Click on **"Storage"**
   - If you see "Get started" button, click it first:
     - Click **"Get started"**
     - Select **"Start in production mode"**
     - Use the same location as Firestore
     - Click **"Done"**
     - Wait for Storage to be enabled

### Step 2: Open the Rules Tab
1. At the top of the Storage page, you'll see tabs: **"Files"**, **"Rules"**
2. Click on the **"Rules"** tab

### Step 3: View Current Rules
- You'll see default rules (usually):
  ```
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write: if false;
      }
    }
  }
  ```

### Step 4: Delete the Default Rules
1. Select all the text in the rules editor (Ctrl+A or Cmd+A)
2. Delete it (press Delete or Backspace)

### Step 5: Copy Storage Rules from Your Project
1. Open the file `storage.rules` from your project folder
2. Select all the content (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### Step 6: Paste into Firebase Console
1. Click in the empty rules editor in Firebase Console
2. Paste the rules (Ctrl+V or Cmd+V)
3. You should see rules for:
   - Profiles (user profile images)
   - Videos (video files)
   - Thumbnails (video thumbnails)

### Step 7: Validate the Rules
1. Firebase will automatically validate the rules
2. Look for any red error messages
3. If you see errors, check the syntax

### Step 8: Publish the Rules
1. Click the **"Publish"** button at the top right
2. A confirmation dialog will appear
3. Click **"Publish"** to confirm
4. Wait for the rules to be published

### Step 9: Verify Rules are Published
- You should see a message: "Rules published successfully"
- The rules are now active

---

## Visual Guide - What You'll See

### Firestore Rules Page:
```
┌─────────────────────────────────────────────────┐
│ Firestore Database                              │
├─────────────────────────────────────────────────┤
│ [Data] [Rules] [Indexes] [Usage]                │
├─────────────────────────────────────────────────┤
│                                                 │
│ rules_version = '2';                            │
│ service cloud.firestore {                       │
│   match /databases/{database}/documents {       │
│     // Your rules here...                       │
│   }                                             │
│ }                                               │
│                                                 │
│                          [Publish] [Cancel]     │
└─────────────────────────────────────────────────┘
```

### Storage Rules Page:
```
┌─────────────────────────────────────────────────┐
│ Storage                                         │
├─────────────────────────────────────────────────┤
│ [Files] [Rules]                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ rules_version = '2';                            │
│ service firebase.storage {                      │
│   match /b/{bucket}/o {                         │
│     // Your rules here...                       │
│   }                                             │
│ }                                               │
│                                                 │
│                          [Publish] [Cancel]     │
└─────────────────────────────────────────────────┘
```

---

## Important Notes

### ⚠️ Before Publishing:
1. **Backup**: If you have existing rules, copy them first
2. **Test Mode**: For development, you can use test mode initially
3. **Validation**: Always check for errors before publishing

### ✅ After Publishing:
1. Rules take effect immediately
2. All future requests will use the new rules
3. You can edit and republish anytime

### 🔒 Security Reminders:
1. **Never** allow `allow read, write: if true` in production
2. Always test rules in test mode first
3. Review rules periodically for security

### 🐛 Troubleshooting:

**Error: "Rules are not valid"**
- Check for syntax errors (missing brackets, quotes)
- Verify all helper functions are defined
- Check that collection names match your code

**Error: "Permission denied"**
- Verify user is authenticated
- Check that user has the required role
- Ensure rules are published

**Rules not working:**
- Clear browser cache
- Wait a few minutes for rules to propagate
- Check Firebase console for error logs

---

## Quick Checklist

- [ ] Firestore Database created
- [ ] Firestore Rules tab opened
- [ ] Default rules deleted
- [ ] Rules from `firestore.rules` copied and pasted
- [ ] Rules validated (no errors)
- [ ] Firestore rules published
- [ ] Storage enabled
- [ ] Storage Rules tab opened
- [ ] Default rules deleted
- [ ] Rules from `storage.rules` copied and pasted
- [ ] Rules validated (no errors)
- [ ] Storage rules published
- [ ] Both rules published successfully

---

## Next Steps After Setting Rules

1. **Create an Admin User** (see README.md for details)
2. **Test the rules** by trying to:
   - Create a user account
   - Upload a profile image
   - Access admin dashboard (as admin)
   - Upload a video (as admin)

3. **Monitor**: Check Firebase Console > Firestore Database > Usage for any permission errors

---

## Need Help?

If you encounter issues:
1. Check the Firebase Console for error messages
2. Review the rules syntax
3. Test in test mode first
4. Check Firebase documentation: https://firebase.google.com/docs/firestore/security/get-started

