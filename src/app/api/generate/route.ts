import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import {
    descriptionMessage,
    titleMessage,
    tagMessage,
    introductionMessage,
    choicePromptMessages
} from '../../helper/completionMessages'
import { mockStream } from "../completion/mockAI";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY || ''
});

export async function GET() {
    try {
        // return new StreamingTextResponse(mockStream());

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [{ "role": "user", "content": descriptionMessage }]
        });

        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    } catch (error: any) {
        return NextResponse.json({}, { status: 400, statusText: error.message })
    }
}

export async function POST(req: NextRequest) {
    try {
        let messages: any[] = [];
        const body = await req.json()

        if (body.generate == 'title') {
            messages = [{ "role": "assistant", "content": titleMessage(body.description) }]
        } else if (body.generate == 'tag') {
            messages = [{ "role": "assistant", "content": tagMessage(body.description) }]
        } else if (body.generate == 'introduction') {
            messages = [{ "role": "assistant", "content": introductionMessage(body.description) }]
        } else if (body.generate == 'choice') {
            messages = choicePromptMessages([body.introduction], body.choices)
        } else throw new Error('invalid generate request')

        if (body.instruction) {
            messages[messages.length-1].content += '\n\n' + body.instruction
        }

        // console.log('messages: ', messages);
        // return new StreamingTextResponse(mockStream());
        
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: messages
        });

        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    } catch (error: any) {
        return NextResponse.json({}, { status: 400, statusText: error.message })
    }
}