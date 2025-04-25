import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";

const { User } = models;

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get token from headers
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Find user by token
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
} 