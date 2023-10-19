import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function GET(req: Request) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [{ "role": "user", "content": "hi!!" }]
        });
    
        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);
        // console.log('stream: ', stream);
        // Respond with the stream
        return new StreamingTextResponse(stream);
        
    } catch (error) {
        console.log(error);
        
    }
    // Extract the `prompt` from the body of the request

    // Ask OpenAI for a streaming chat completion given the prompt
}