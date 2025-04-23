import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const {Attendance} = models;
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
       return NextResponse.json(
        {message:`the attendance is posted successfully the token is ${token} `},
        {status:201}
    )
    } catch (error) {
        return NextResponse.json(
            {error:"unable to add attendance"},
            {status:404}
        )
    }
    
}