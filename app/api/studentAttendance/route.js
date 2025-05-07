import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { UserAttendance } = models;

export async function GET(request) {
    const token = request.headers.get("authorization").split(" ")[1];
    try {
        await connectToDatabase();
        const attendanceData = await UserAttendance.find({userId:token});
       console.log(token);
        return NextResponse.json(attendanceData);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}