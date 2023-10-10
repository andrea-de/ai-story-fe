import { NextRequest, NextResponse } from 'next/server';
import { createStory, getStories } from '../../helper/actions';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const queryParams = new URLSearchParams(url.search);
        const page: number = parseInt(queryParams.get('page') || '1');
        const limit: number = parseInt(queryParams.get('limit') || '3');
        const stories = await getStories(page, limit)
        return Response.json(stories)
    } catch (error: any) {
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const created = await createStory(body.description, body.parts, body.choices)
        return NextResponse.json({ tag: created.tag });
    } catch (error: any) {
        throw error;
    }
}
