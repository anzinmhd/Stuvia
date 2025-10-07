import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { validateRequiredFields, sanitizeInput, validateAdminAccess } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const authResult = await validateAdminAccess();
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    try {
      const holidaysRef = db.collection('holidays');
      const snapshot = await holidaysRef
        .where('year', '==', parseInt(year))
        .get();

      const holidays = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort holidays by date on the server side
      holidays.sort((a, b) => {
        const dateA = new Date(a.fromDate || a.date);
        const dateB = new Date(b.fromDate || b.date);
        return dateA.getTime() - dateB.getTime();
      });

      return NextResponse.json({ holidays });
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      // Return empty array if collection doesn't exist yet
      return NextResponse.json({ holidays: [] });
    }
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate admin access
    const authResult = await validateAdminAccess();
    if ('error' in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    
    // Check if it's a date range or single date
    const isDateRange = body.fromDate && body.toDate;
    const requiredFields = isDateRange 
      ? ['fromDate', 'toDate', 'title', 'type']
      : ['date', 'title', 'type'];
    
    // Validate required fields
    const validationError = validateRequiredFields(body, requiredFields);
    
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    if (isDateRange) {
      if (!dateRegex.test(body.fromDate) || !dateRegex.test(body.toDate)) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        );
      }
      
      // Validate date range
      const fromDate = new Date(body.fromDate);
      const toDate = new Date(body.toDate);
      
      if (fromDate > toDate) {
        return NextResponse.json(
          { error: 'From date must be before or equal to To date' },
          { status: 400 }
        );
      }
    } else {
      if (!dateRegex.test(body.date)) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        );
      }
    }

    // Validate type
    const validTypes = ['public', 'unexpected', 'working_saturday'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid holiday type' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const baseData = {
      title: sanitizeInput(body.title),
      type: sanitizeInput(body.type),
      description: body.description ? sanitizeInput(body.description) : '',
      createdAt: new Date().toISOString(),
      createdBy: authResult.user.email || 'unknown'
    };

    if (isDateRange) {
      // For date ranges, create a single holiday entry with from/to dates
      const sanitizedData = {
        ...baseData,
        fromDate: sanitizeInput(body.fromDate),
        toDate: sanitizeInput(body.toDate),
        year: new Date(body.fromDate).getFullYear(),
        isRange: true
      };

      // Check for overlapping holidays in the range
      const fromDate = new Date(body.fromDate);
      const toDate = new Date(body.toDate);
      
      // Check if any existing holidays overlap with this range
      const existingHolidays = await db
        .collection('holidays')
        .where('year', '==', sanitizedData.year)
        .get();

      const hasOverlap = existingHolidays.docs.some((doc: any) => {
        const data = doc.data();
        if (data.isRange) {
          const existingFrom = new Date(data.fromDate);
          const existingTo = new Date(data.toDate);
          return (fromDate <= existingTo && toDate >= existingFrom);
        } else {
          const existingDate = new Date(data.date);
          return existingDate >= fromDate && existingDate <= toDate;
        }
      });

      if (hasOverlap) {
        return NextResponse.json(
          { error: 'Holiday range overlaps with existing holidays' },
          { status: 409 }
        );
      }

      // Add holiday range to database
      const docRef = await db.collection('holidays').add(sanitizedData);

      return NextResponse.json({
        success: true,
        id: docRef.id,
        holiday: { id: docRef.id, ...sanitizedData }
      });
    } else {
      // Single date holiday
      const sanitizedData = {
        ...baseData,
        date: sanitizeInput(body.date),
        year: new Date(body.date).getFullYear(),
        isRange: false
      };

      // Check if holiday already exists for this date
      const existingHoliday = await db
        .collection('holidays')
        .where('date', '==', sanitizedData.date)
        .get();

      if (!existingHoliday.empty) {
        return NextResponse.json(
          { error: 'Holiday already exists for this date' },
          { status: 409 }
        );
      }

      // Add holiday to database
      const docRef = await db.collection('holidays').add(sanitizedData);

      return NextResponse.json({
        success: true,
        id: docRef.id,
        holiday: { id: docRef.id, ...sanitizedData }
      });
    }
  } catch (error) {
    console.error('Error creating holiday:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Validate admin access
    const authResult = await validateAdminAccess();
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const holidayId = searchParams.get('id');

    if (!holidayId) {
      return NextResponse.json(
        { error: 'Holiday ID is required' },
        { status: 400 }
      );
    }

    // Check if holiday exists
    const holidayDoc = await db.collection('holidays').doc(holidayId).get();
    if (!holidayDoc.exists) {
      return NextResponse.json(
        { error: 'Holiday not found' },
        { status: 404 }
      );
    }

    // Delete holiday
    await db.collection('holidays').doc(holidayId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
