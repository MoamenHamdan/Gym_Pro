# ProGym - Professional Fitness Training Website

A modern, responsive gym website built with Next.js, React, TypeScript, Tailwind CSS, and Firebase. Features a beautiful glassmorphism UI design with comprehensive fitness program management, video content delivery, and admin dashboard.

## Features

- 🎨 **Modern Glassmorphism UI** - Futuristic, iPhone-like glass design with smooth animations
- 🔐 **Authentication** - Firebase Email/Password authentication
- 👤 **User Profiles** - Profile management
- 🎥 **Video Programs** - Three categories: Fat Loss, Gain Muscle, Weight Gain (using video URLs)
- 📊 **Progress Tracking** - Track video completion progress per user
- 👥 **Admin Dashboard** - Manage users, videos, and programs
- 🔒 **Access Control** - Admin can grant/revoke service access to users
- 📱 **Responsive Design** - Mobile-first, accessible design
- ⚡ **Fast Performance** - Optimized for speed and SEO
- 💰 **No Storage Costs** - Uses only Firestore (free tier) and external video URLs

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore only - no Storage needed)
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Videos**: Uses external URLs (YouTube, Vimeo, etc.) - no file storage

## Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "ralph fyp"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "progym")
   - Enable Google Analytics (optional)
   - Click "Create project"

2. **Enable Authentication**
   - In Firebase Console, go to Authentication
   - Click "Get started"
   - Enable "Email/Password" provider
   - Click "Save"

3. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in "Production mode" (we'll set rules later)
   - Choose a location close to your users
   - Click "Enable"

   **Note**: You don't need to enable Storage - this project uses external video URLs instead!

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click on Web icon (</>)
   - Register app with a nickname (e.g., "ProGym Web")
   - Copy the Firebase configuration object

6. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Set Firestore Security Rules**
   - Go to Firestore Database > Rules
   - Copy the contents of `firesstore.rules`
   - Paste into the rules editor
   - Click "Publish"

   **Note**: You don't need to set Storage rules - Storage is not used in this project!

### 4. Create Admin User

See **ADMIN_DASHBOARD_ACCESS.md** for detailed instructions on creating an admin user.

1. **Create User in Firebase Authentication**
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email and password
   - Click "Add user"
   - Copy the User UID

2. **Set Admin Role in Firestore**
   - Go to Firestore Database
   - Create a document in `users` collection with the User UID as document ID
   - Add the following fields:
     ```json
     {
       "displayName": "Admin",
       "email": "admin@example.com",
       "role": "admin",
       "enrolledCategories": [],
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
     ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── about/          # About page
│   │   ├── admin/          # Admin dashboard
│   │   ├── community/      # Community page
│   │   ├── login/          # Login/Signup page
│   │   ├── profile/        # User profile page
│   │   ├── services/       # Services page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── home/          # Home page components
│   │   └── layout/        # Layout components (Navbar, Footer)
│   └── lib/               # Utility libraries
│       ├── auth.tsx       # Authentication context
│       └── firebase.ts    # Firebase configuration
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
└── README.md             # This file
```

## Usage

### As a User

1. **Sign Up/Login**
   - Click "Join Now" in the navbar
   - Create an account or login
   - Complete your profile

2. **Browse Services**
   - Go to Services page
   - View available program categories
   - Request access or purchase if needed

3. **Watch Videos**
   - Access granted categories
   - Watch videos and mark them as completed
   - Track your progress

### As an Admin

1. **Access Admin Dashboard**
   - Login as admin user
   - Click "Admin" in the navbar (or go to `/admin`)
   - See **ADMIN_DASHBOARD_ACCESS.md** for setup instructions

2. **Manage Users**
   - View all users
   - Grant/revoke access to service categories
   - Toggle access with checkmarks

3. **Add Videos**
   - Go to Videos tab
   - Click "Add New Video"
   - Enter video URL (YouTube, Vimeo, or any video hosting service)
   - Enter thumbnail URL (optional)
   - Fill in title, description, category, duration
   - Video will be available to users with access

4. **Manage Programs**
   - Go to Programs tab
   - Add new programs
   - Delete existing programs

## Data Model

### Users Collection
```typescript
{
  displayName: string
  email: string
  photoURL?: string
  role: 'user' | 'admin'
  enrolledCategories: string[]
  bio?: string
  goals?: string
  selectedPrograms?: string[]
  createdAt: string
  updatedAt: string
}
```

### Programs Collection
```typescript
{
  title: string
  slug: string
  description: string
  icon: string
  difficulty: string
  tags: string[]
}
```

### Videos Collection
```typescript
{
  title: string
  description: string
  category: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: string
  published: boolean
  createdBy: string
  createdAt: string
}
```

### Progress Subcollection (users/{uid}/progress/{videoId})
```typescript
{
  completed: boolean
  completedAt?: string
}
```

## Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `out`
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. **Build the Project**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   - Go to Vercel project settings
   - Add all Firebase environment variables
   - Redeploy

## Security Notes

- Never commit `.env.local` file to version control
- Firebase security rules are essential for data protection
- Admin users should be created carefully
- Consider using Firebase Cloud Functions for sensitive operations
- Regularly review and update security rules

## Troubleshooting

### Firebase Configuration Errors
- Ensure all environment variables are set correctly
- Check that Firebase project is active
- Verify API keys are correct

### Authentication Issues
- Check that Email/Password provider is enabled
- Verify Firestore rules allow user creation
- Check browser console for errors

### Video URL Issues
- Ensure video URLs are valid and accessible
- Check that URLs are from supported platforms (YouTube, Vimeo, etc.)
- Verify thumbnail URLs are valid image URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

## Demo Credentials

**Admin Account:**
- Email: admin@progym.com (create this in Firebase Auth)
- Password: (set during user creation)

**Test User Account:**
- Email: user@progym.com (create this in Firebase Auth)
- Password: (set during user creation)

Remember to set the admin role in Firestore after creating the admin user!

## Next Steps

1. Add payment integration for service purchases
2. Implement email notifications
3. Add analytics tracking
4. Create mobile app version
5. Add live chat support
6. Implement social features
7. Add workout scheduling
8. Create nutrition tracking

---

Built with ❤️ for ProGym

