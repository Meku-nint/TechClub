import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/connectdb";
import models from "../../../../model/schema";
const { User, Attendance, UserAttendance } = models;

export async function GET(request) {
  try {
    await connectToDatabase();
        const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }
    const admin = await User.findOne({ token, role: 'admin' });
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }
    const postedAttendance = await Attendance.findOne({ date });
    if (!postedAttendance) {
      return NextResponse.json(
        { error: "Attendance not posted for this day" },
        { status: 400 }
      );
    }

    const userAttendance = await UserAttendance.find({ date })
      .populate('userId', 'name email username')
      .sort({ createdAt: -1 });

    return NextResponse.json(userAttendance);

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
    await connectToDatabase();
    
    // Get token from headers
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Verify admin user
    const admin = await User.findOne({ token, role: 'admin' });
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { userId, date, status } = body;

    if (!userId || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if attendance is posted for the day
    const postedAttendance = await Attendance.findOne({ date });
    if (!postedAttendance) {
      return NextResponse.json(
        { error: "Attendance not posted for this day" },
        { status: 400 }
      );
    }
    const userAttendance = await UserAttendance.findOneAndUpdate(
      { userId, date },
      { status },
      { new: true, upsert: true }
    ).populate('userId', 'name email username');

    return NextResponse.json(userAttendance);

  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
} 