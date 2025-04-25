import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";

const { User } = models;

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate a new token for the session
    const token = Math.random().toString(36).slice(2);
    user.token = token;
    await user.save();

    // Return success response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(
      { 
        message: "Login successful",
        user: userWithoutPassword
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
