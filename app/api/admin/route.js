import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { Admin} = models;
export async function POST(request){
    await connectToDatabase();
    try {
        const body=await request.json();
        const {email,password}=body;
        const newAdmin=new Admin({
            email,
            password
        })
        await newAdmin.save();
         return NextResponse.json(
                    { message: "Admin is added successfully" },
                    { status: 200 }
                );
    } catch (error) {
                return NextResponse.json(
                    {error:"unable to add the admin"},
                    {status:404}
                )
    }
}