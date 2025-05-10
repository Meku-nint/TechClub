import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/connectdb";
import models from "../../../../model/schema";
const { Admin } = models;

export async function POST(request) {
    const { email, password } = await request.json();
    try {
        await connectToDatabase();
        if(!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }
        const newAdmin= await new Admin({email,password});
        await newAdmin.save();
        return NextResponse.json({
            message:"Admin created successfully",
        })
        
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );      
    }
}