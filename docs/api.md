# API Documentation - Stuvia

Stuvia provides a set of RESTful API endpoints for managing attendance, profiles, and administrative tasks. All API routes are located under `/api/`.

## 🔐 Authentication
Most endpoints require an active session managed by NextAuth.js. Requests without a valid session will return a `401 Unauthorized` response.

---

## 📅 Attendance APIs

### Mark Attendance
`POST /api/attendance/mark`

Marks a student as present or absent for a specific period.

**Request Body:**
```json
{
  "semester": "string",
  "subjectId": "string",
  "status": "present" | "absent",
  "period": number,
  "date": "YYYY-MM-DD",
  "notes": "string (optional)"
}
```

**Response:**
- `200 OK`: `{ "success": true }`
- `400 Bad Request`: `{ "error": "Missing required fields" }`
- `401 Unauthorized`: `{ "error": "Unauthorized" }`

---

### Get Attendance Insights
`GET /api/attendance/insights?semester=S6`

Calculates attendance statistics for the current user.

**Query Parameters:**
- `semester` (required): The semester ID to fetch insights for.

**Response:**
```json
{
  "bySubject": [
    {
      "subjectId": "MATH101",
      "held": 20,
      "present": 18,
      "percent": 90,
      "safeBunksLeft": 2
    }
  ],
  "overallPercent": 85.5,
  "totalHeld": 100,
  "totalPresent": 85
}
```

---

## 👤 Profile APIs

### Update Profile
`POST /api/profile`

Updates the user's branch, division, and semester information.

**Request Body:**
```json
{
  "name": "string",
  "branch": "string",
  "division": "string",
  "semester": "string"
}
```

---

## 🛠️ Administrative APIs

### Manage Templates
`POST /api/admin/templates`

Creates or updates a class timetable template. Requires admin privileges.

---

## ⚠️ Error Handling

Stuvia APIs use standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (Validation failed)
- `401`: Unauthorized (Authentication required)
- `403`: Forbidden (Insufficient permissions)
- `500`: Internal Server Error

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```
