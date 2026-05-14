# Onboarding & Authentication Flow - Stuvia

Stuvia implements a strict onboarding process to ensure all students have complete profiles and secure accounts.

## 🔐 Authentication Layers

1. **Domain Restriction**: Only emails ending in `@rajagiri.edu.in` are permitted to sign in via NextAuth callbacks.
2. **JWT Augmentation**: After sign-in, the JWT is augmented with:
   - `role`: Admin or User.
   - `profileCompleted`: Boolean indicating if the Firestore profile is complete.
   - `hasPasswordProvider`: Boolean indicating if the user has set a password (for Google-only sign-ins).

## 🚀 Onboarding Flow

The `middleware.ts` acts as the traffic controller for the application. It enforces the following flow:

### 1. The Trigger
A user is redirected to `/onboarding` if:
- They are authenticated.
- **AND** (`profileCompleted` is false **OR** `hasPasswordProvider` is false).
- **AND** they don't have a temporary `onboarded` cookie.

### 2. The Onboarding Page
On this page, users must:
- Set a password (if they signed in via Google for the first time).
- Fill in their academic details (Branch, Division, Semester).

### 3. Completion
Once the form is submitted:
- The user's profile is updated in Firestore (`upsertProfile`).
- The `profileCompleted` flag is set to true.
- The user is redirected to the `/dashboard`.

## 🛡️ Route Protection

- **Public Routes**: `/login`, `/signup`.
- **Protected Routes**: `/dashboard`, `/settings`. (Redirects to `/login` if unauthenticated).
- **Admin Routes**: `/admin`, `/api/admin`. (Redirects to `/dashboard` if authenticated but not an admin).
- **Onboarding Guard**: Prevents access to the dashboard until the profile is complete.

## 🍪 Cookies
- `onboarded`: A temporary cookie used to bypass middleware checks immediately after onboarding completion before the JWT refreshes.
