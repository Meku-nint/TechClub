import { NextResponse } from "next/server";
import models from "../../../../model/schema";
import connectToDatabase from "../../../../lib/connectdb";
const { Attendance } = models;
export  async function GET(){
    try {
        await connectToDatabase();
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const lastRecord = await Attendance.findOne().sort({ _id: -1 });
        const formattedLast=lastRecord.createdAt.toISOString().split('T')[0];
        if(formattedDate==formattedLast){
            return NextResponse.json(
                {lastRecord},
                {status:200}
            )
        }
        else{
            return NextResponse.json(
                {error:"There is no Attendance"},
                {status:400}
            )
        }
    } catch (error) {
        return NextResponse.json(
            {error:"There is no Attendance"},
            {status:404}
        )
    }}