import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const {Attendance,UserAttendance,User} = models;
export async function POST(request) {
    await connectToDatabase();
    try {
        const body=await request.json();
       const{today,length}=body;
       if(!today||!length){
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
          );
       }
       const token=Math.floor(Math.random()*1000000).toString()
       const newAttendance=new Attendance({
        today,
        length,
        token
       })
       await newAttendance.save();
    const lastAttendance=await Attendance.findOne({}).sort({createdAt:-1});
    const AttendanceId=lastAttendance._id;
    const attendanceDate=lastAttendance.today;
    const users = await User.find({}, "_id name");
    for(let i=0;i<users.length;i++){
        const userId=users[i]._id;
        const userName=users[i].name;
        const userAttendance=new UserAttendance({
            userId,
            userName,
            date:attendanceDate,
            status:"absent",
            attendanceID:AttendanceId
        })
        await userAttendance.save();
    }

    return NextResponse.json(
        {message:`the attendance is posted successfully the token is ${token} `},
        {status:201}
    )

    } catch (error) {
        return NextResponse.json(
            {error:error.message},
            {status:404}
        )
    }
    
}