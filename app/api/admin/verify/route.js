import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/connectdb";
import models from "../../../../model/schema";
const { User } = models;

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Find admin user with token
    const admin = await User.findOne({ token, role: 'admin' });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Token is valid
    return NextResponse.json({
      valid: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 500 }
    );
  }
} 