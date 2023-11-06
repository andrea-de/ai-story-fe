import { NextRequest, NextResponse } from 'next/server';
import { Story } from '@/app/helper/connection';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        // userdb

        const story = new Story({
            name: body.name,
            description: body.description,
            instruction: body.instruction,
            tag: body.tag,
            blurb: body.description,
            storyLengthMin: body.parts - 1,
            storyLengthMax: body.parts + 1,
            choicesLength: body.choicesLength,
            segments: body.segments,
            choices: body.choices,
            // user: userdb
        });

        // Change tag if taken and return tag
        await story.save();

        return NextResponse.json(story.tag);
    } catch (error: any) {
        console.error('error: ', error.message);
        return NextResponse.json(null, { status: 400, statusText: JSON.stringify(error.message) })
    }
}

// Todo: Persist User, Unique Tag