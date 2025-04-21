import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/connectdb.js";
import User from "../../../model/schema.js";
export async function POST(request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            return NextResponse.json(
                { error: "Invalid JSON in request body", details: parseError.message },
                { status: 400 }
            );
        }
        
        const { name, email, username, password } = body;
        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        try {
            await connectToDatabase();
        } catch (dbError) {
            return NextResponse.json(
                { error: "Database connection failed", details: dbError.message },
                { status: 500 }
            );
        }
        try {
            let existingUser = await User.findOne({ username });
            let existingEmail = await User.findOne({ email });

            if (existingUser) {
                return NextResponse.json(
                    { error: "User already exists" },
                    { status: 400 }
                );
            }

            if (existingEmail) {
                return NextResponse.json(
                    { error: "Email already exists" },
                    { status: 400 }
                );
            }
        } catch (findError) {
            return NextResponse.json(
                { error: "Error checking for existing user", details: findError.message },
                { status: 500 }
            );
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashError) {
            return NextResponse.json(
                { error: "Error hashing password", details: hashError.message },
                { status: 500 }
            );
        }
        try {
            const user = new User({
                name,
                email,
                username,
                password: hashedPassword
            });

            await user.save();            
            return NextResponse.json(
                { message: "User created successfully" },
                { status: 201 }
            );
        } catch (saveError) {
            return NextResponse.json(
                { error: "Failed to save user", details: saveError.message },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: "An unexpected error occurred", details: error.message },
            { status: 500 }
        );
    }
}                   