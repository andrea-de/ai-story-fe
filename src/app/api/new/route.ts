import { NextRequest, NextResponse } from 'next/server';
import { createStory, getStories } from '../../helper/actions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const created = await createStory(body.description, body.parts, body.choices)
        return NextResponse.json(created);
    } catch (error: any) {
        return NextResponse.json(null, { status: 400, statusText: error.message })
    }
}
