// route.js file is for API endpoints such as GET, POST, PUT, DELETE
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/connectdb.js";
import User from "../../../model/schema.js";

export async function POST(request) {
    try {
        console.log('Starting user creation process...');
        
        // Parse request body first to validate input
        let body;
        try {
            body = await request.json();
            console.log('Request body parsed successfully:', { ...body, password: '[REDACTED]' });
        } catch (parseError) {
            console.error('Error parsing request body:', parseError);
            return NextResponse.json(
                { error: "Invalid JSON in request body", details: parseError.message },
                { status: 400 }
            );
        }
        
        const { name, email, username, password } = body;

        // Validate required fields
        if (!name || !email || !username || !password) {
            console.log('Missing required fields:', { name: !!name, email: !!email, username: !!username, password: !!password });
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Connect to database
        console.log('Connecting to database...');
        try {
            await connectToDatabase();
            console.log('Database connected successfully');
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return NextResponse.json(
                { error: "Database connection failed", details: dbError.message },
                { status: 500 }
            );
        }

        // Check for existing user
        console.log('Checking for existing user...');
        try {
            let existingUser = await User.findOne({ username });
            let existingEmail = await User.findOne({ email });

            if (existingUser) {
                console.log('Username already exists:', username);
                return NextResponse.json(
                    { error: "User already exists" },
                    { status: 400 }
                );
            }

            if (existingEmail) {
                console.log('Email already exists:', email);
                return NextResponse.json(
                    { error: "Email already exists" },
                    { status: 400 }
                );
            }
        } catch (findError) {
            console.error('Error checking for existing user:', findError);
            return NextResponse.json(
                { error: "Error checking for existing user", details: findError.message },
                { status: 500 }
            );
        }

        // Hash password
        console.log('Hashing password...');
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully');
        } catch (hashError) {
            console.error('Error hashing password:', hashError);
            return NextResponse.json(
                { error: "Error hashing password", details: hashError.message },
                { status: 500 }
            );
        }

        // Create and save user
        console.log('Creating new user...');
        try {
            const user = new User({
                name,
                email,
                username,
                password: hashedPassword
            });

            console.log('Saving user to database...');
            await user.save();
            console.log('User saved successfully');
            
            return NextResponse.json(
                { message: "User created successfully" },
                { status: 201 }
            );
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            return NextResponse.json(
                { error: "Failed to save user", details: saveError.message },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Unhandled error in user creation:', error);
        return NextResponse.json(
            { error: "An unexpected error occurred", details: error.message },
            { status: 500 }
        );
    }
}                   