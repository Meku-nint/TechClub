import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/connectdb.js";
import models from "../../../model/schema.js";
const{UserAttendance}=models;
export async function GET(request){
    try {

        await connectToDatabase();
        const lastAttendance = await UserAttendance.findOne().sort({ createdAt: -1 });  
        if (!lastAttendance) {
            return NextResponse.json({ error: "No attendance found" }, { status: 404 });
        }      
        const lastAttendanceRecord=lastAttendance.attendanceID;
        const userAttendances=await UserAttendance.find({ attendanceID: lastAttendanceRecord });
        if (!userAttendances || userAttendances.length === 0) {
            return NextResponse.json({ error: "No attendance found" }, { status: 404 });
        }
        return NextResponse.json(userAttendances);
    }
    catch{
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// for checking purpose.