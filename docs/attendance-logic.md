# Attendance Logic - Stuvia

The core of Stuvia is its intelligent attendance tracking system. This document explains the logic used to determine subject schedules, handle exceptions, and calculate insights.

## 🗓️ Timetable Structure

Stuvia uses a template-based timetable system. Each class (defined by branch, division, and semester) has a `TimetableTemplate` that specifies:
- **Periods per Day**: Usually 6 or 7.
- **Weekly Schedule**: A mapping of days (Mon-Sat) to a list of periods, each with a `subjectId`.

## 🔄 Effective Subject Calculation

Calculating which subject is being held at a specific time is not just a lookup in the timetable. The system considers several override layers:

1. **Holidays**: If a date is marked as a holiday, all periods are cancelled.
2. **Early Closure**: A holiday can specify an `earlyCloseAfterPeriod`. Periods after this index are cancelled.
3. **Global Class Changes**: Admins can swap subjects or cancel specific periods for an entire class on a specific date.
4. **User-Specific Changes**: Students can manually override their own schedule if they attended a different class or if their specific elective changed.
5. **Timetable Fallback**: If no overrides exist, the system falls back to the default weekly timetable.

The logic is implemented in `lib/attendance/db.ts` under the `getEffectiveSubjectForDate` function.

## 📊 Attendance Insights

The system calculates several key metrics to help students stay on track:

### 1. Subject-wise Statistics
For each subject, the system calculates:
- **Held**: Total number of periods where the subject was scheduled (considering all overrides).
- **Present**: Total number of periods marked as "present" by the user.
- **Percent**: `(Present / Held) * 100`.

### 2. Safe Bunks Calculation
The "Safe Bunks" metric tells a student how many classes they can miss without falling below the minimum required percentage (usually 75%).

**Formula**:
`Safe Bunks = floor(Present / MinimumRequiredRate) - Held`

Example:
- Present: 15
- Held: 18
- Min Required: 75% (0.75)
- `15 / 0.75 = 20`
- `20 - 18 = 2` (The student can miss 2 more classes).

## 🗃️ Data Management

- **Attendance Logs**: Stored in the `attendance` collection with fields `uid`, `date`, `periodIndex`, `subjectId`, and `status`.
- **Subject Catalog**: Each user has a `subjects` document that stores the list of subjects they are currently taking, including display names and colors.
