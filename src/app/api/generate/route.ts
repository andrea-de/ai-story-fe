import { NextResponse } from "next/server";
import { ChatGPTClient } from "@/app/helper/openai";


export async function GET() {
    const description = await ChatGPTClient.generateDescription()
    return NextResponse.json({ description: description });
}