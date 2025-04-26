import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/connectdb';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { date, records } = body;

    if (!date || !records) {
      return NextResponse.json({ error: 'Date and records are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const attendanceCollection = db.collection('manual_attendance');

    // Update or insert attendance record
    await attendanceCollection.updateOne(
      { date },
      { $set: { date, records } },
      { upsert: true }
    );

    // Update student attendance statistics
    const studentsCollection = db.collection('students');
    for (const record of records) {
      const student = await studentsCollection.findOne({ _id: record.userId });
      if (student) {
        const newTotal = (student.attendance?.total || 0) + 1;
        const newPresent = (student.attendance?.present || 0) + (record.status === 'present' ? 1 : 0);
        const newPercentage = Math.round((newPresent / newTotal) * 100);

        await studentsCollection.updateOne(
          { _id: record.userId },
          {
            $set: {
              'attendance.total': newTotal,
              'attendance.present': newPresent,
              'attendance.percentage': newPercentage
            }
          }
        );
      }
    }

    return NextResponse.json({ message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving manual attendance:', error);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const attendanceCollection = db.collection('manual_attendance');

    const attendance = await attendanceCollection.findOne({ date });
    
    return NextResponse.json(attendance?.records || []);
  } catch (error) {
    console.error('Error fetching manual attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
} 