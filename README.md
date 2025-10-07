# Stuvia - College Attendance Management System

A modern, secure web application for managing college attendance with QR code-based sessions and comprehensive admin controls.

## 🚀 Features

- **Secure Authentication**: Multi-provider auth with Firebase and NextAuth.js
- **Profile Management**: Complete student profile system with validation
- **Admin Dashboard**: Comprehensive admin controls and reporting
- **Attendance Tracking**: QR code-based attendance system
- **Email Verification**: OTP-based email verification system
- **Responsive Design**: Mobile-first responsive UI with dark mode
- **Security First**: Built with security best practices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js, Firebase Auth
- **Database**: Firebase Firestore
- **Email**: Nodemailer with SMTP
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- Firebase project with Firestore and Authentication enabled
- SMTP email service (Gmail, SendGrid, etc.)
- Google OAuth credentials (optional)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd stuvia-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in all the required environment variables in `.env.local`:

   ```env
   # Generate with: openssl rand -base64 32
   NEXTAUTH_SECRET=your-secure-secret-here
   NEXTAUTH_URL=http://localhost:3000

   # Firebase configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@yourdomain.com

   # Admin emails (comma-separated)
   ADMIN_EMAILS=admin@rajagiri.edu.in
   ```

4. **Set up Firebase**

   - Create a Firebase project
   - Enable Authentication with Email/Password and Google providers
   - Enable Firestore Database
   - Download service account key and add to environment variables

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🔐 Security Configuration

### Firebase Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{email} {
      allow read, write: if request.auth != null && request.auth.token.email == email;
    }

    // Admin-only collections
    match /templates/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }

    // OTP collection (system use only)
    match /emailOtps/{document=**} {
      allow read, write: if false; // Server-side only
    }
  }
}
```

### Environment Security

- **Never commit `.env.local`** to version control
- Use strong, randomly generated secrets
- Enable Firebase App Check in production
- Use HTTPS in production
- Implement proper CORS policies

## 📁 Project Structure

```
stuvia-web/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── settings/          # User settings
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── attendance/       # Attendance-specific components
├── lib/                   # Utility libraries
│   ├── firebase/         # Firebase configuration
│   ├── attendance/       # Attendance logic
│   └── auth.ts           # NextAuth configuration
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard
   - Deploy

3. **Configure production settings**
   - Update `NEXTAUTH_URL` to your production domain
   - Enable HTTPS
   - Configure custom domain (optional)

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `NEXTAUTH_SECRET` - Strong random secret
- `NEXTAUTH_URL` - Your production URL
- Firebase configuration variables
- SMTP configuration
- Admin email addresses

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Monitoring

### Logging

The application includes comprehensive logging for:

- Authentication events
- Security incidents
- API errors
- Database operations

### Error Tracking

Consider integrating with:

- Sentry for error tracking
- LogRocket for session replay
- Firebase Analytics for usage metrics

## 🔒 Security Best Practices

1. **Authentication**

   - Strong password requirements
   - Rate limiting on auth endpoints
   - Secure session management

2. **Authorization**

   - Role-based access control
   - Proper middleware protection
   - Admin access logging

3. **Data Protection**

   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection

4. **Infrastructure**
   - HTTPS enforcement
   - Secure headers
   - CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the documentation
- Review security guidelines in `SECURITY.md`
- Create an issue on GitHub

## 🔄 Changelog

### v1.0.0

- Initial release
- Basic authentication system
- Profile management
- Admin dashboard
- Security improvements

---

**⚠️ Important**: Always review the `SECURITY.md` file for security guidelines and best practices before deploying to production.

cfc6863e68e0f2a7daca62137ace86deec5278f8
