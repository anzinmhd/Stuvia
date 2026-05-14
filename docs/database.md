# Database Schema - Stuvia

Stuvia uses **Google Cloud Firestore** (NoSQL) for data storage. This document outlines the collection structure and document models.

## 🗄️ Collections

### 1. `users`
Stores user profiles and application-specific settings.
- **Document ID**: Email address (lowercase)
- **Model**: `UserProfile`

| Field | Type | Description |
|-------|------|-------------|
| `email` | `string` | User's college email address. |
| `name` | `string` | Full name of the student. |
| `branch` | `string` | Academic branch (e.g., CSE, ECE). |
| `division` | `string` | Class division (e.g., Alpha, A, B). |
| `semester` | `string` | Current semester (1-8). |
| `role` | `string` | User role (`user` or `admin`). |
| `profileCompleted`| `boolean`| True if all required profile fields are filled. |

---

### 2. `templates`
Stores timetable templates for different classes.
- **Document ID**: `${branch}_${division}_${semester}` (lowercase)
- **Model**: `TimetableTemplate`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier. |
| `branch` | `string` | Branch this template belongs to. |
| `division` | `string` | Division. |
| `semester` | `string` | Semester. |
| `periodsPerDay` | `number` | Total periods in a day. |
| `subjects` | `Subject[]` | Array of subjects offered in the semester. |
| `timetable` | `WeeklyTimetable`| The actual weekly schedule. |
| `updatedAt` | `number` | Epoch timestamp of last update. |

---

### 3. `attendance`
Stores the attendance logs for each user.
- **Document ID**: Auto-generated
- **Model**: `AttendanceLog`

| Field | Type | Description |
|-------|------|-------------|
| `uid` | `string` | User ID/Email. |
| `date` | `string` | YYYY-MM-DD. |
| `periodIndex` | `number` | 0-based index of the period. |
| `subjectId` | `string` | Subject ID from the template. |
| `status` | `string` | `present` or `absent`. |
| `markedAt` | `number` | Epoch timestamp of marking. |

---

### 4. `holidays`
Stores institutional holidays and class cancellations.
- **Document ID**: YYYY-MM-DD
- **Model**: `Holiday`

---

### 5. `emailOtps`
Internal collection for managing email verification codes.
- **Document ID**: Email address
- **Fields**: `otp`, `expiresAt`.

## 🛡️ Security Rules

Firestore security rules are configured to ensure:
- Users can only read/write their own profiles.
- Admins have full access to `templates` and `holidays`.
- The `emailOtps` collection is protected from direct client-side access (Server-side only).

Example Rule Logic:
```javascript
match /users/{email} {
  allow read, write: if request.auth != null && request.auth.token.email == email;
}
```
