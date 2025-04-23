import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { Event } = models;
export async function POST(request){
    await connectToDatabase();
    if(!connectToDatabase){
        console.log("pr")
    }
    try {
        const body=await request.json();
        const {description,address}=body;
        if(!description||!address){
           return NextResponse.json(
                {error:"all fields are required"},
                {status: 400},
            )
        }
        else {
            const newEvent=new Event({
                description,
                address
            });
            await newEvent.save();
         return NextResponse.json(
                {message:"The event is posted successfully"},
                {status:201}
            )
        }
    } catch (error) {
        return NextResponse.json(
            {error:"unable to post the event"},
            {status:404}
        )
    }
}