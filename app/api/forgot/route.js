import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { User } = models;
export async function POST (request){
    try {
        await connectToDatabase();
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }
        const user = await User.findOne({ token});
        if (!user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: `use this token as password and change it after login: ${user.forgot}`},
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during password reset:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred", details: error.message },
            { status: 500 }
        );
    }  
}