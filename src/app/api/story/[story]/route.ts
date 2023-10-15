import { NextRequest, NextResponse } from 'next/server';
import { getStory, getStoryAtPosition, postStoryAction } from '../../../helper/actions';
import chalk from 'chalk';

export async function GET(req: NextRequest, { params }: { params: { story: string } }, res: NextResponse ) {
    try {
        const tag = params.story;
        const url = new URL(req.url);
        const queryParams = new URLSearchParams(url.search);
        const position: string | null = queryParams.get('position')
        const story = position == undefined ? await getStory(tag) : await getStoryAtPosition(tag, position)
        return Response.json(story)
    } catch (error: any) {
        if (error.message.includes('TagInvalid')) return NextResponse.json(null, { status: 404, statusText: error.message })
        else return NextResponse.json(null, { status: 400, statusText: error.message })
    }
}

export async function POST(req: NextRequest, { params }: { params: { story: string } }, res: NextResponse) {
    try {
        // waitUntil
        const tag = params.story;
        const body = await req.json()
        const response = await postStoryAction(tag, body.action, true)
        return NextResponse.json(response)
    } catch (error: any) {
        return NextResponse.json(null, { status: 400, statusText: error.message })
    }
}