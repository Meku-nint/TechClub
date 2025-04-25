import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/connectdb";
import models from "../../../../model/schema";
const { User, UserAttendance } = models;

export async function GET(request) {
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

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get total attendance records count
    const totalAttendance = await UserAttendance.countDocuments();

    // Get today's attendance counts
    const todayAttendance = await UserAttendance.find({ date: today });
    const presentToday = todayAttendance.filter(record => record.status === 'present').length;
    const absentToday = todayAttendance.filter(record => record.status === 'absent').length;

    return NextResponse.json({
      totalUsers,
      totalAttendance,
      presentToday,
      absentToday
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
} 