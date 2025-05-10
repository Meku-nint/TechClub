import { NextResponse } from "next/server";
import models from "../../../../model/schema";
import connectToDatabase from "../../../../lib/connectdb";
const { Attendance } = models;
export async function GET() {
  try {
    await connectToDatabase();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    const lastRecord = await Attendance.findOne().sort({ createdAt: -1 });

    if (!lastRecord || !lastRecord.today) {
      return NextResponse.json(
        { error: "No valid attendance record found" },
        { status: 404 }
      );
    }
    const lastDate = lastRecord.createdAt.toISOString().split('T')[0];
    const todayDate = now.toISOString().split('T')[0];
    const lastTime=lastRecord.length;
    if (todayDate == lastDate && time < lastTime) {
      return NextResponse.json(lastRecord, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "There is no Attendance" },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
