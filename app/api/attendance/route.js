import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { User, UserAttendance, Attendance } = models;
export async function GET(request) {
  try {
    await connectToDatabase();
    const lastAttendance = await Attendance.findOne({}).sort({ _id: -1 });
    const lastAttendanceID = lastAttendance.attendanceID;
    const attendanceRecords = await UserAttendance.find({lastAttendanceID});
    if (!attendanceRecords) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(attendanceRecords);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
} 
