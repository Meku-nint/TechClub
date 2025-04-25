import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/connectdb";
import models from "../../../model/schema";
const { Event, AdminInfo } = models;

export async function GET() {
    try {
        await connectToDatabase();
        const events = await Event.find();
        const contact = await AdminInfo.findOne();
        return NextResponse.json({ events, contact });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}