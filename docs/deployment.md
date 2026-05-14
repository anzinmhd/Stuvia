# Deployment Guide - Stuvia

This guide covers the steps required to deploy Stuvia to a production environment (Vercel) and set up the necessary cloud services.

## 📋 Prerequisites
- A Google Cloud / Firebase account.
- A Vercel account.
- A GitHub repository with the Stuvia codebase.
- SMTP credentials (e.g., Gmail App Password or SendGrid API Key).

---

## 🔥 Firebase Setup

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click "Add project" and follow the instructions.

2. **Enable Firestore**:
   - In the sidebar, click "Firestore Database".
   - Click "Create database" and choose "Production mode".
   - Select a location close to your users.

3. **Enable Authentication**:
   - Go to "Authentication" -> "Get started".
   - Enable "Email/Password" and "Google" providers.
   - For Google, ensure you whitelist your production domain in the settings.

4. **Service Account Key**:
   - Go to "Project Settings" -> "Service accounts".
   - Click "Generate new private key".
   - Copy the values to your environment variables (see below).

---

## 🔐 Environment Variables

Add the following variables to your Vercel project settings:

### NextAuth & Security
| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | A long random string (generate with `openssl rand -base64 32`). |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://stuvia.vercel.app`). |
| `ADMIN_EMAILS` | Comma-separated list of admin emails. |

### Firebase Client (Public)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Project Settings -> General. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g., `my-project.firebaseapp.com`. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID. |

### Firebase Admin (Private)
| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID. |
| `FIREBASE_CLIENT_EMAIL` | From the service account JSON. |
| `FIREBASE_PRIVATE_KEY` | From the service account JSON (include `\n` characters). |

### SMTP Configuration
| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | e.g., `smtp.gmail.com`. |
| `SMTP_PORT` | e.g., `587`. |
| `SMTP_USER` | Your email address. |
| `SMTP_PASS` | Your app password or API key. |
| `SMTP_FROM` | "Stuvia <noreply@yourdomain.com>". |

---

## 🚀 Vercel Deployment

1. **Connect Repository**:
   - In Vercel, click "Add New" -> "Project".
   - Import your Stuvia repository.

2. **Configure Build Settings**:
   - Framework Preset: `Next.js`.
   - Build Command: `npm run build`.
   - Output Directory: `.next`.

3. **Deploy**:
   - Click "Deploy". Vercel will build and deploy your application.

4. **Post-Deployment**:
   - Verify the deployment by logging in with a `@rajagiri.edu.in` email.
   - Ensure Firestore rules are applied via the Firebase CLI or Console.

---

## 🔄 Maintenance & Updates

- **Database Backups**: Use Google Cloud's automated Firestore backups.
- **Monitoring**: Check Vercel logs and Firebase Analytics for usage patterns and errors.
- **Security Audit**: Regularly rotate `NEXTAUTH_SECRET` and service account keys.
