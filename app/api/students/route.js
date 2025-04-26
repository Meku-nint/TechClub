import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { User } = models;

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all users with their attendance data
    const users = await User.find({})
      .select('name studentId attendance')
      .lean();

    // Calculate attendance percentage for each user
    const usersWithPercentage = users.map(user => {
      // Initialize attendance if it doesn't exist
      const attendance = user.attendance || {
        present: 0,
        total: 0
      };

      return {
        ...user,
        attendance: {
          present: attendance.present || 0,
          total: attendance.total || 0,
          percentage: attendance.total > 0 
            ? Math.round((attendance.present / attendance.total) * 100)
            : 0
        }
      };
    });

    return NextResponse.json(usersWithPercentage);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 