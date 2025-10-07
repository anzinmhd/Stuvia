# 🚀 Deployment Checklist for Stuvia

## ✅ Pre-Deployment Security Checklist

### Critical (Must Do Before Deployment):

- [ ] **Rotate Firebase Credentials**
  - Firebase private key was previously committed to git
  - Generate NEW service account key from Firebase Console
  - Update `FIREBASE_PRIVATE_KEY` in production environment
  - Update `FIREBASE_CLIENT_EMAIL` if changed

- [ ] **Set All Environment Variables**
  ```bash
  # Generate secure NEXTAUTH_SECRET
  openssl rand -base64 32
  ```
  - [ ] NEXTAUTH_SECRET (use generated value above)
  - [ ] NEXTAUTH_URL (your production URL)
  - [ ] All Firebase variables
  - [ ] All SMTP variables
  - [ ] ADMIN_EMAILS

- [ ] **Update Git History** (Optional but Recommended)
  - The private key file was committed previously
  - Consider using git-filter-branch or BFG Repo-Cleaner to remove from history
  - Or start fresh repository if possible

- [ ] **Test Rate Limiting**
  - Try multiple failed logins (should block after 5 attempts)
  - Try multiple OTP requests (should block after 3 attempts)
  - Verify proper 429 responses

### High Priority:

- [ ] **Set up Error Tracking**
  - Sentry, LogRocket, or similar
  - Replace console.error with proper logging

- [ ] **Enable Firebase Security Rules**
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{email} {
        allow read, write: if request.auth != null && 
                          request.auth.token.email == email;
      }
      match /templates/{document=**} {
        allow read, write: if request.auth != null && 
                          request.auth.token.role == 'admin';
      }
      match /emailOtps/{document=**} {
        allow read, write: if false;
      }
    }
  }
  ```

- [ ] **Test All Authentication Flows**
  - Email/Password login
  - Google OAuth login
  - Password reset
  - Profile completion
  - Admin access

### Medium Priority:

- [ ] Add HTTPS enforcement
- [ ] Configure CORS properly
- [ ] Set up monitoring/alerts
- [ ] Add Content Security Policy headers
- [ ] Enable Firebase App Check

---

## 🔧 Build & Deploy Commands

```bash
# 1. Install dependencies
npm install

# 2. Run linter
npm run lint

# 3. Build for production
npm run build

# 4. Test production build locally
npm run start

# 5. Deploy to Vercel
vercel --prod
```

---

## 📝 Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required:
```
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_FIREBASE_API_KEY=<from Firebase>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<from Firebase>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<from Firebase>
FIREBASE_PROJECT_ID=<from Firebase>
FIREBASE_CLIENT_EMAIL=<NEW key from Firebase>
FIREBASE_PRIVATE_KEY=<NEW key from Firebase>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<app-password>
SMTP_FROM=noreply@yourdomain.com
ADMIN_EMAILS=admin@rajagiri.edu.in
```

### Optional:
```
GOOGLE_CLIENT_ID=<if using Google OAuth>
GOOGLE_CLIENT_SECRET=<if using Google OAuth>
```

---

## 🧪 Post-Deployment Testing

### 1. Authentication Tests:
```bash
# Test email/password login
curl -X POST https://yourdomain.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@rajagiri.edu.in","password":"test123"}'

# Expected: 200 OK or appropriate error
```

### 2. Rate Limiting Tests:
```bash
# Send multiple requests rapidly
for i in {1..10}; do
  curl https://yourdomain.com/api/user-exists?email=test@rajagiri.edu.in
done

# Expected: After 100 requests/min, should get 429
```

### 3. Error Boundary Tests:
- Navigate to a non-existent page
- Verify error page displays correctly
- Test "Try Again" and "Go Home" buttons

### 4. Admin Access Tests:
- Login as admin (email in ADMIN_EMAILS)
- Verify can access /admin
- Login as regular user
- Verify CANNOT access /admin (redirects with error)

---

## 📊 Monitoring Setup

### Recommended Services:

1. **Error Tracking:** Sentry
   ```bash
   npm install @sentry/nextjs
   ```

2. **Performance:** Vercel Analytics (built-in)
   
3. **Uptime:** UptimeRobot or similar
   - Monitor: https://yourdomain.com
   - Monitor: https://yourdomain.com/api/health (create this)

4. **Logs:** Vercel Logs or external service

---

## 🔍 Health Check Endpoint (Recommended)

Create `app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  });
}
```

---

## 🚨 Rollback Plan

If deployment fails:

1. **Vercel:** Use "Redeploy" on previous working deployment
2. **Environment Variables:** Keep backup of working values
3. **Database:** Firebase has automatic backups
4. **Logs:** Check Vercel deployment logs for errors

---

## 📈 Success Metrics

After deployment, monitor:

- [ ] Login success rate > 95%
- [ ] API response time < 500ms
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%
- [ ] No security incidents

---

## 🔐 Security Monitoring

### Week 1 After Deployment:
- Monitor for unusual authentication patterns
- Check rate limiting effectiveness
- Review error logs for security issues
- Verify admin access restrictions working

### Monthly:
- Review user activity logs
- Check for failed login attempts
- Update dependencies (npm audit)
- Review Firebase security rules

---

## 📞 Emergency Contacts

If critical issues arise:

1. **Disable Authentication:**
   - Set NEXTAUTH_SECRET to random value to log everyone out

2. **Disable Admin Access:**
   - Clear ADMIN_EMAILS environment variable

3. **Emergency Shutdown:**
   - Pause deployment in Vercel Dashboard

---

## ✅ Final Verification

Before marking deployment complete:

- [ ] All environment variables set
- [ ] Firebase credentials rotated
- [ ] Can login successfully
- [ ] Admin panel works
- [ ] Rate limiting works
- [ ] Error boundaries work
- [ ] No console errors in production
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Email sending works

---

**Deployment Prepared By:** AI Code Analyst  
**Date:** October 3, 2025  
**Status:** Ready for Production 🚀

