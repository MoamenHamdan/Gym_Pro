# ProGym - Professional Fitness Training Website

A modern fitness training website built with Next.js, React, TypeScript, and Firebase.

## Features

- 🎨 Modern glassmorphism UI design with animations
- 🔐 User authentication and profiles
- 🎥 Video programs (Fat Loss, Gain Muscle, Weight Gain)
- 📊 Progress tracking for completed videos
- 👥 Admin dashboard for managing content
- 👨‍🏫 Coaches management
- 📅 Events and workshops calendar
- 👥 Member groups with scoring system
- 🏆 Challenges and competitions
- 💬 User feedback system
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore)
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase (see `FIREBASE.md`)

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Pages (home, admin, profile, services, etc.)
├── components/       # React components
└── lib/             # Firebase and auth utilities
```

## How to Use

### For Users
- Sign up/Login
- Browse programs and services
- Watch videos and track progress
- Join groups and participate in challenges
- Submit feedback

### For Admins
- Manage users and access
- Add/edit/delete videos (using URLs)
- Manage programs, coaches, events
- Add competitions and "Why Join Us" content

## Important Notes

- **Videos**: Use video URLs (YouTube, Vimeo, etc.) - paste URLs in admin dashboard
- **Images**: Use image URLs for pictures, thumbnails, etc.
- **No File Uploads**: All media uses URLs - simple and free!

## Documentation

- See `FIREBASE.md` for Firebase setup instructions

## License

MIT License
