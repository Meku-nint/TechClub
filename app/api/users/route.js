import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/connectdb.js";
import models from "../../../model/schema";
const { AllowStudent, User } = models;

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { name, email, username, password } = body;

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const isAllowed = await AllowStudent.findOne({ studentId: username });
    if (!isAllowed) {
      return NextResponse.json(
        { error: "User is not allowed to register" },
        { status: 400 }
      );
    }
    const existing = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existing) {
      const conflict = existing.username === username ? "User" : "Email";
      return NextResponse.json(
        { error: `${conflict} already exists` },
        { status: 400 }
      );
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Hash error:", err);
      return NextResponse.json(
        { error: "Error hashing password", details: err.message },
        { status: 500 }
      );
    }
    const token = Math.random().toString(36).slice(2);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      token
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: err.message },
      { status: 500 }
    );
  }
}
