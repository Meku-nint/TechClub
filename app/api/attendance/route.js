import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { UserAttendance } = models;
export async function GET(request) {
  try {
    await connectToDatabase();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    const attendanceRecords = await UserAttendance.find({ userId: token });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return NextResponse.json({ error: "No attendance found" }, { status: 404 });
    }

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
