# Firebase Rules Setup - Quick Visual Guide

## 🔥 Firestore Rules Setup

### 1. Go to Firebase Console
```
https://console.firebase.google.com/
```

### 2. Select Your Project
- Click on your project name (or create new one)

### 3. Open Firestore Database
```
Left Sidebar → Build → Firestore Database
```

### 4. Click "Rules" Tab
```
[Data] [Rules] [Indexes] [Usage]
         ↑ Click here
```

### 5. Delete Default Rules
- Select ALL text (Ctrl+A / Cmd+A)
- Delete it

### 6. Copy Rules from File
1. Open `firestore.rules` file in your project
2. Select ALL content (Ctrl+A)
3. Copy (Ctrl+C)

### 7. Paste in Firebase Console
1. Click in the rules editor
2. Paste (Ctrl+V)
3. You should see all the rules

### 8. Click "Publish"
```
[Publish] button at top right
```

### 9. Confirm
- Click "Publish" in the confirmation dialog
- Wait for "Rules published successfully" message

---

## 📦 Storage Rules Setup

### 1. Go to Storage
```
Left Sidebar → Build → Storage
```

### 2. Click "Rules" Tab
```
[Files] [Rules]
         ↑ Click here
```

### 3. Delete Default Rules
- Select ALL text (Ctrl+A / Cmd+A)
- Delete it

### 4. Copy Rules from File
1. Open `storage.rules` file in your project
2. Select ALL content (Ctrl+A)
3. Copy (Ctrl+C)

### 5. Paste in Firebase Console
1. Click in the rules editor
2. Paste (Ctrl+V)
3. You should see all the rules

### 6. Click "Publish"
```
[Publish] button at top right
```

### 7. Confirm
- Click "Publish" in the confirmation dialog
- Wait for "Rules published successfully" message

---

## ✅ Done!

Both rules are now set up and active.

---

## 📋 What Each Rule Does

### Firestore Rules:
- ✅ Users can read/update their own profile
- ✅ Admins can read/update all users
- ✅ Everyone can read programs
- ✅ Only admins can create/update programs
- ✅ Authenticated users can read videos
- ✅ Only admins can create/update videos
- ✅ Users can track their own video progress

### Storage Rules:
- ✅ Users can upload their own profile images
- ✅ Authenticated users can read all profile images
- ✅ Only admins can upload videos
- ✅ Authenticated users can read videos
- ✅ Only admins can upload thumbnails

---

## 🎯 Quick Checklist

Firestore:
- [ ] Opened Firestore Database
- [ ] Clicked Rules tab
- [ ] Deleted default rules
- [ ] Pasted rules from `firestore.rules`
- [ ] Clicked Publish
- [ ] Saw success message

Storage:
- [ ] Opened Storage
- [ ] Clicked Rules tab
- [ ] Deleted default rules
- [ ] Pasted rules from `storage.rules`
- [ ] Clicked Publish
- [ ] Saw success message

---

## 💡 Pro Tips

1. **Always validate**: Check for red error messages before publishing
2. **Test first**: Use test mode for development
3. **Backup**: Copy existing rules before changing
4. **Wait**: Rules take effect immediately after publishing

---

## 🆘 Common Issues

**"Rules are not valid"**
→ Check for syntax errors (missing brackets, quotes)

**"Permission denied" after publishing**
→ Verify user is authenticated and has correct role

**Rules not working**
→ Wait 1-2 minutes for rules to propagate
→ Clear browser cache
→ Check Firebase console logs

