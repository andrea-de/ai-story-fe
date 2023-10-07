import { NextResponse } from 'next/server';

const api_url = process.env.REACT_APP_API_URI + '/api/';

export async function GET() {
    try {
        const response = await fetch(api_url + 'ai/generate', { cache: 'no-store' })
            .then(res => res.json())
        return NextResponse.json({ description: response.description });
    } catch (error: any) {
        return NextResponse.json({ error: { messagee: error.message } });
    }
}
