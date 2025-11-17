# ProGym - Project Summary

## 📋 Overview
**ProGym** is a modern, full-featured fitness training platform built as a Final Year Project (FYP). It provides a comprehensive solution for fitness enthusiasts to access workout programs, track progress, interact with coaches, and participate in community events.

## 🎯 Project Purpose
A professional fitness training website that connects users with workout programs, coaches, and a supportive fitness community through an intuitive, modern web application.

## ✨ Key Features

### 👤 User Features
- **Authentication & Profiles**
  - User registration and login
  - Personal profile management
  - Role-based access (user/admin)

- **Fitness Programs**
  - Three main program categories:
    - Fat Loss
    - Gain Muscle
    - Weight Gain
  - Video-based workout content
  - Progress tracking for completed videos
  - Day-by-day program structure (28-day programs)

- **AI Fitness Assistant** 🤖
  - Powered by OpenRouter API
  - Uses `openai/gpt-oss-20b:free` model (100% free)
  - Answers fitness, nutrition, and workout questions
  - Conversation history support
  - Focused on fitness topics only

- **Community Features**
  - Events and workshops calendar
  - Member groups with scoring system
  - Challenges and competitions
  - Event details and registration

- **User Experience**
  - Modern glassmorphism UI design
  - Smooth animations (Framer Motion)
  - Fully responsive design
  - User feedback system
  - Contact form with messaging

### 🔧 Admin Features
- **User Management**
  - View all users
  - Assign admin roles
  - Manage user access and enrolled categories

- **Content Management**
  - **Videos**: Add/edit/delete workout videos
    - Support for video URLs (YouTube, Vimeo)
    - Direct file upload (base64 storage)
    - Video chunking for large files
    - Thumbnail management
  - **Programs**: Manage fitness programs
  - **Coaches**: Add/edit coaches with bios and badges
  - **Events**: Create and manage workshops/events
  - **Competitions**: Organize fitness challenges
  - **Why Join Us**: Manage promotional content

- **Communication**
  - View and manage user messages
  - Mark messages as read/unread
  - Reply to user inquiries

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: 
  - Tailwind CSS
  - Custom glassmorphism design
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Hot Toast

### Backend & Database
- **Backend**: Firebase
  - Authentication (Email/Password)
  - Firestore Database
  - No Firebase Storage (uses base64 for files)
- **API**: Next.js API Routes
  - OpenRouter API integration for AI chatbot

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- PostCSS & Autoprefixer

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── login/             # Authentication
│   ├── profile/           # User profile
│   ├── admin/             # Admin dashboard
│   ├── chatbot/           # AI assistant
│   ├── community/         # Events & community
│   ├── services/          # Services page
│   ├── about/             # About page
│   ├── contact/           # Contact form
│   └── api/               # API routes
│       └── chatbot/       # AI chatbot API
├── components/
│   ├── home/              # Home page components
│   │   ├── Hero.tsx
│   │   ├── Programs.tsx
│   │   ├── Features.tsx
│   │   └── ...
│   └── layout/            # Layout components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── AnimatedBackground.tsx
└── lib/                   # Utilities
    ├── firebase.ts        # Firebase config
    ├── auth.tsx           # Auth context
    ├── fileUtils.ts       # File handling
    └── videoUtils.ts      # Video chunking
```

## 🔐 Security & Authentication

- **Protected Routes**: Authentication required for most pages
- **Admin Protection**: Admin-only routes for dashboard
- **Firestore Security Rules**: Configured in `firestore.rules`
- **Environment Variables**: Sensitive keys stored in `.env.local`

## 📊 Data Management

### Firestore Collections
- `users` - User profiles and roles
- `videos` - Workout videos
- `programs` - Fitness programs
- `coaches` - Coach information
- `events` - Community events
- `competitions` - Fitness challenges
- `whyJoinUs` - Promotional content
- `messages` - User contact messages

### File Storage Strategy
- **Images**: Base64 encoding (max 10MB)
- **Videos**: 
  - Base64 encoding (max 50MB)
  - Chunked storage in subcollections for large files
  - Support for external URLs (YouTube, Vimeo)

## 🎨 Design Features

- **Glassmorphism UI**: Modern frosted glass effect
- **Gradient Backgrounds**: Purple/slate color scheme
- **Smooth Animations**: Page transitions and interactions
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Professional dark color palette

## 🚀 Setup & Deployment

### Prerequisites
- Node.js 18+
- Firebase account
- OpenRouter API key (for AI chatbot)

### Environment Variables Required
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenRouter (AI Chatbot)
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-oss-20b:free
```

### Installation
```bash
npm install
npm run dev
```

## 📝 Documentation Files

- `README.md` - Project overview and quick start
- `FIREBASE.md` - Firebase setup instructions
- `AI_SETUP.md` - AI chatbot configuration guide
- `firestore.rules` - Database security rules

## 🎓 Project Type
**Final Year Project (FYP)** - A complete full-stack web application demonstrating modern web development practices, database management, and AI integration.

## 🌟 Highlights

1. **Complete CRUD Operations**: Full content management system
2. **AI Integration**: Free AI chatbot for fitness assistance
3. **Modern UI/UX**: Professional, animated, responsive design
4. **Scalable Architecture**: Clean code structure, TypeScript
5. **Free Tier Friendly**: Uses free Firebase services and free AI model
6. **User-Centric**: Focus on user experience and engagement

## 📈 Future Enhancements (Potential)

- Payment integration for premium programs
- Real-time chat between users and coaches
- Mobile app version
- Advanced analytics and progress tracking
- Social features (friends, sharing achievements)
- Video streaming optimization
- Multi-language support

---

**Built with ❤️ for fitness enthusiasts**

