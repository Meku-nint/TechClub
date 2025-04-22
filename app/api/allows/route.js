import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { AllowStudent } = models;
export async function POST(request) {
    try {
        await connectToDatabase();
    } 
    catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            { error: "Database connection failed", details: error.message },
            { status: 500 }
        );
    } 
    
    try {
        const data = await request.json();
        const { studentId } = data;
        
        if (!studentId) {
            return NextResponse.json(
                { error: "Student ID is required" },
                { status: 400 }
            );
        }
        
        let existingUser = await AllowStudent.findOne({ studentId });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }
        
        const user = new AllowStudent({
            studentId,
        });
        
        await user.save();
        return NextResponse.json(
            { message: "User is allowed successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: "Failed to create user", details: error.message },
            { status: 500 }
        );
    }
} 