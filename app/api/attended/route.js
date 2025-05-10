import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { UserAttendance } = models;

export async function PATCH( request) {
  await connectToDatabase();
  try {
    const { userId, attendanceID } = await request.json();
    
    if (!userId || !attendanceID) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const updatedAttendance = await UserAttendance.findOneAndUpdate(
      { userId, attendanceID },
      { status: "present" },
      { new: true }
    );

    if (!updatedAttendance) {
      return NextResponse.json(
        { error: "Attendance not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Attendance filled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Unable to update attendance" },
      { status: 500 }
    );
  }
}
