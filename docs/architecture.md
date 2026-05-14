# System Architecture - Stuvia

This document provides a high-level overview of the Stuvia system architecture, including the tech stack, data flow, and key components.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Firebase Auth integration
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/UI](https://ui.shadcn.com/)
- **Email**: [Nodemailer](https://nodemailer.com/) for OTP and notifications
- **Deployment**: [Vercel](https://vercel.com/)

## 🏗️ Core Modules

### 1. Authentication System
Stuvia uses a hybrid authentication model:
- **NextAuth.js**: Manages sessions, JWTs, and provider callbacks.
- **Firebase Auth**: Used as the identity provider for credentials (email/password).
- **Google OAuth**: Supported for seamless college-domain login.
- **Domain Restriction**: Only emails ending in `@rajagiri.edu.in` are permitted to sign in.

### 2. Attendance Engine (`lib/attendance`)
The core logic for managing timetables, sessions, and attendance logs:
- **Timetable Management**: Supports flexible weekly schedules with period-level granularity.
- **QR Code System**: (Coming soon/In progress) Generates secure, time-bound QR codes for attendance marking.
- **Insights**: Calculates attendance percentages, safe bunk counts, and subject-wise statistics.

### 3. Admin Dashboard
A dedicated space for administrators to:
- Manage class templates and timetables.
- Monitor attendance trends.
- Handle class changes and holiday declarations.

## 🔄 Data Flow

### Authentication Flow
1. User attempts to sign in via Google or Credentials.
2. NextAuth validates the email domain (`@rajagiri.edu.in`).
3. On first successful sign-in, a profile is automatically created in Firestore (`lib/userStoreFirebase.ts`).
4. Role is assigned (admin/user) based on environment variables or Firestore profile.
5. A JWT is issued containing the user's role and profile completion status.

### Attendance Marking Flow
1. Admin/System creates a session for a period.
2. Student scans QR code or marks attendance via the dashboard.
3. System validates the request (location, timestamp, and active session).
4. An `AttendanceLog` document is created/updated in Firestore.
5. Insights are re-calculated or updated in the UI.

## 📁 Directory Structure

```
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/          # Authentication-related pages (login, register)
│   ├── admin/           # Admin-only dashboard and tools
│   ├── api/             # Backend API endpoints
│   ├── dashboard/       # Student dashboard
│   └── settings/        # User profile and account settings
├── components/          # React components
│   ├── ui/             # Shared UI primitives (Shadcn)
│   ├── attendance/     # Attendance-specific components
│   └── layout/         # Header, Footer, and navigation
├── lib/                 # Shared utilities and logic
│   ├── attendance/     # Core attendance domain logic
│   ├── firebase/       # Firebase Admin & Client SDK initialization
│   ├── auth.ts         # NextAuth configuration
│   └── utils.ts        # General utility functions
└── public/             # Static assets (images, logos)
```
