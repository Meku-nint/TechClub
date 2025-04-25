import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/connectdb";
import models from "../../../../model/schema";
const { Admin } = models;

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const isPasswordValid = await (password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        admin.token = token;
    await admin.save();

    return NextResponse.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
} 