import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/connectdb.js";
import models from "../../../model/schema.js";
const{User,AllowStudent}=models;
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, username, password } = body;
        const forgotPassword=password;
        const allowed=await AllowStudent.findOne({studentId:username});
        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        if (!allowed) {
            return NextResponse.json(
                { error: "You are not allowed to register" },
                { status: 403 }
            );
        }
        await connectToDatabase();
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 400 }
            );
        }
        if (existingEmail) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }
        const token= Math.floor((Math.random()+1)*1000000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            username,
            password: hashedPassword,
            forgot:forgotPassword,
            token,
        });

        await user.save();
        return NextResponse.json(
            { message: `register successfully don't forget save the token "${token}"` },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred", details: error.message },
            { status: 500 }
        );
    }
}