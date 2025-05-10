import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { AdminInfo } = models;
export async function POST(request) {
    await connectToDatabase();
    try {
        const body=await request.json();
        const {email,telegram,phone,location,prove}=body;
        await AdminInfo.findOneAndDelete({prove});
        const newAdminInfo=new AdminInfo({
           email,
           telegram,
           phone,
           location
        })
        await newAdminInfo.save();
       
         return NextResponse.json(
                    { message: "Admin information is updated successfully" },
                    { status: 200 }
                );
    } catch (error) {
        console.error("Error updating admin information:", error);
                return NextResponse.json(
                    {error:"unable to update the admin information"},
                    {status:404}
                )
    }
}