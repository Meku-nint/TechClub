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
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
 
   const userObj = user.toObject();
delete userObj.password;
return NextResponse.json(
  {
    message: "Login successful",
    user: userObj
  },
  { status: 200 }
);

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}