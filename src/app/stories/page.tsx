import Link from "next/link";
import { Suspense } from "react";
import StoryCard from "../components/StoryCard";

const api_url = process.env.REACT_APP_API_URI + '/api/';

export default async function StoriesPage({ searchParams }: { searchParams: { page: number } }) {
    const page: number = Number(searchParams.page) || 1;
    const limit = 3;

    const loadStories = async () => {
        try {
            const stories = await fetch(api_url + 'story?page=' + page + '&limit=' + limit + '&', { cache: 'no-store' })
                .then(res => res.json())
            if (stories.error) throw stories.error
            return stories
        } catch (error) {
            // Error message
            return []
        }
    }

    const stories = await loadStories()

    const prev = page > 1 ? true : false
    const next = stories && stories.length > 3 ? true : false


    return ((stories!=undefined && stories.length) ?
        <Suspense fallback={<p>Loading data...</p>}>
            <div className="flex-col">
                <StoriesList page={page} stories={stories.slice(0, 3)} />
                <Navigation page={page} prev={prev} next={next} />
            </div>
        </Suspense> :
        <p>Loading data...</p>
    )
}

const StoriesList = async ({ stories, page = 1 }: { stories: any[], page: number }) => {
    return (
        <div className="">
            <h1 className="text-4xl text-center mr-10">Stories</h1>
            <div className="story-list overflow-y-scroll my-5" style={{ maxHeight: '65svh' }}>
                {Object.keys(stories).length > 0 &&
                    (stories.map((story => (StoryCard(story)))))
                }
            </div>
        </div>
    )
}

const Navigation = async ({ page = 1, prev, next }: { page: number, prev: boolean, next: boolean }) => {
    return (
        <div className="w-full flex justify-between pr-5">
            <Link
                className={`px-5 py-2 rounded-md + ${prev ? "bg-secondary" : "bg-gray-700"}`}
                style={{ pointerEvents: prev ? undefined : 'none' }}
                href={'/stories?page=' + (Number(page) - 1)}>
                <div>Previous</div>
            </Link>
            <Link
                className={`px-5 py-2 rounded-md + ${next ? "bg-secondary" : "bg-gray-700"}`}
                style={{ pointerEvents: next ? undefined : 'none' }}
                href={'/stories?page=' + (Number(page) + 1)}>
                <div>Next</div>
            </Link>
        </div>
    )
}