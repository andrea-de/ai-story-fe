import { NextRequest, NextResponse } from 'next/server';

const api_url = process.env.REACT_APP_API_URI + '/api/';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const tag = url.searchParams.get('tag') || '';
        const pointer = url.searchParams.get('pointer') || '0';
        const response: any = await fetch(api_url + 'story/tag/' + tag + '/' + pointer)
        if (!response.ok) throw response
        const res = await response.json();
        return NextResponse.json(res);
    } catch (error: any) {
        const err = await error.json();
        console.log(err);
        return err
    }
}

export async function POST(request: NextRequest) {
    try {
        const response = await fetch(api_url + 'story/action/', request)
        if (!response.ok) throw response
        const res = await response.json();
        return NextResponse.json(res);
    } catch (error: any) {
        const err = await error.json();
        console.log(error);
        console.log(err);
        return err
    }
}
