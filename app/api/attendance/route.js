import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { User, UserAttendance, Attendance } = models;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    await connectToDatabase();
    const { UserAttendance } = models;

    // If date is provided, fetch attendance for that date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const attendance = await UserAttendance.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).populate('userId', 'name email username');

      return NextResponse.json(attendance);
    }

    // If no date provided, return all attendance records
    const attendance = await UserAttendance.find()
      .populate('userId', 'name email username')
      .sort({ date: -1 });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { date, token, records } = await request.json();
    
    if (!date || !token || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const { UserAttendance } = models;

    // Check if attendance already exists for this date
    const existingAttendance = await UserAttendance.findOne({
      date: new Date(date)
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: "Attendance already marked for this date" },
        { status: 400 }
      );
    }

    // Create attendance records for each user
    const attendanceRecords = records.map(record => ({
      userId: record.userId,
      date: new Date(date),
      status: record.status,
      token: token
    }));

    const savedRecords = await UserAttendance.insertMany(attendanceRecords);

    return NextResponse.json({
      message: "Attendance saved successfully",
      records: savedRecords
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    );
  }
}

// Add new endpoint to update attendance status
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    // Get token from headers
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Get user from token
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get attendance token from request body
    const { token: attendanceToken } = await request.json();
    if (!attendanceToken) {
      return NextResponse.json(
        { error: "Attendance token is required" },
        { status: 400 }
      );
    }

    // Get today's posted attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const postedAttendance = await Attendance.findOne({
      today: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!postedAttendance) {
      return NextResponse.json(
        { error: "No attendance posted for today" },
        { status: 404 }
      );
    }

    // Verify attendance token
    if (postedAttendance.token !== attendanceToken) {
      return NextResponse.json(
        { error: "Invalid attendance token" },
        { status: 401 }
      );
    }

    // Get today's attendance record
    const attendance = await UserAttendance.findOne({
      userId: user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      return NextResponse.json(
        { error: "No attendance record found for today" },
        { status: 404 }
      );
    }

    // Update status to present
    attendance.status = 'present';
    await attendance.save();

    return NextResponse.json({
      message: "Attendance status updated successfully",
      attendance
    });

  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
} 