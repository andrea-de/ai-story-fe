import { NextRequest } from 'next/server';
import { Story } from '@/app/helper/connection';

export async function GET(req: NextRequest) {
    try {
        const randomStoryTagObject = await Story.aggregate([
            { $sample: { size: 1 } },
            { $project: { _id: 0, tag: 1 } }
        ]);
        return Response.json(randomStoryTagObject[0])
    } catch (error: any) {
        throw error
    }
}
