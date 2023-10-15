import { NextResponse } from "next/server";
import { ChatGPTClient } from "@/app/helper/openai";
import chalk from "chalk";


export async function GET() {
    try {
        const description = await ChatGPTClient.generateDescription()
        return NextResponse.json({ description: description });
    } catch (error: any) {
        return NextResponse.json({}, { status: 400, statusText: error.message })
    }
}