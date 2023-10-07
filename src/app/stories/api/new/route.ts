import { NextRequest, NextResponse } from 'next/server';

const api_url = process.env.REACT_APP_API_URI + '/api/';

export async function POST(request: NextRequest, response: NextResponse) {
    const requestBody = await request.json();
    const newStory = await fetch(api_url + 'story/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    }).then(res => res.json())
    if (newStory.error) throw newStory.error
    return NextResponse.json({ tag: newStory.tag });
}
