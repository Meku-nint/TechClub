import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/connectdb";
import models from "../../../../model/schema";
const { User } = models;

export async function PUT(request) {
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

    // Get user from token
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Save changes
    await user.save();

    // Return updated user data (excluding sensitive information)
    const updatedUser = {
      name: user.name,
      email: user.email,
      username: user.username
    };

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
} 