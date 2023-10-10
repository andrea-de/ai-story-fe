import { NextRequest, NextResponse } from 'next/server';
import { getStory, getStoryAtPosition, postStoryAction } from '../../../helper/actions';

export async function GET(req: NextRequest, { params }: { params: { story: string } }) {
    try {
        const tag = params.story;
        const url = new URL(req.url);
        const queryParams = new URLSearchParams(url.search);
        const position: string | null = queryParams.get('position')
        const story = position == undefined ? await getStory(tag) : await getStoryAtPosition(tag, position)
        return Response.json(story)
    } catch (error: any) {
        throw error
    }
}

export async function POST(req: NextRequest, { params }: { params: { story: string } }) {
    try {
        const tag = params.story;
        const body = await req.json()
        await postStoryAction(tag, body.action, true)
        return new Response('ok')
    } catch (error: any) {
        throw error
    }
}