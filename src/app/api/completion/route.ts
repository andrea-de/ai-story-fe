import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

import { segmentPromptMessages, choicePromptMessages } from '../../helper/completionMessages'
import { Story } from '@/app/helper/connection';
import { mockStream } from "../completion/mockAI";


// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY || ''
});

// export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        let messages: any[] = [];
        const body = await req.json()
        const tag = body.tag

        const story = await Story.findOne({ tag })

        if (body.action == 'generate-segment') {
            messages = segmentPromptMessages(body.segments, body.choice)
        } else if (body.action == 'generate-choices') {
            messages = choicePromptMessages(body.segments, body.choices)
        }

        // console.log('messages: ', messages);
        // return new StreamingTextResponse(mockStream());

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            // messages: [{ "role": "user", "content": "give me a 20 word fun fact" }]
            messages: messages
        });

        const stream = OpenAIStream(response);
        // const stream = mockStream()
        const [streamDB, streamFE] = stream.tee();

        updateDB(story, body.position, body.action, streamDB);
        return new StreamingTextResponse(streamFE);

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({}, { status: 400, statusText: error.message })
    }
}

const updateDB = async (story: Story, position: string, action: string, stream: ReadableStream) => {
    try {
        const reader = stream.getReader();
        let final: string = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const newChunk = Buffer.from(value).toString("utf-8");
            final += newChunk
        }
        if (action == 'generate-segment') {
            story.segments[position] = final
        } else if (action == 'generate-choices') {
            story.choices[position] = final
        }

        // story.markModified('segments'); SAFER
        await Story.updateOne({ tag: story.tag }, { $set: story });
    } catch (error) {
        console.error(error)
    }
}

