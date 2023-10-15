import { NextResponse } from 'next/server';
import { randomStory } from '@/app/helper/actions';

export async function GET() {
    try {
        const story = await randomStory()
        return Response.json(story)
    } catch (error: any) {
        NextResponse.json(null, { status: 400, statusText: error.message })
    }
}
