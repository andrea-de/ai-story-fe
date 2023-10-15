import { Suspense } from "react";
import { getStories } from "../helper/actions";
import Link from "next/link";
import StoryCard from "../components/StoryCard";
import Loading from "../components/Loading";

export default async function StoriesPage({ searchParams }: { searchParams: { page: number } }) {
    const page: number = Number(searchParams.page) || 1;
    const prev = page > 1 ? true : false
    const limit = 3;
    const stories = await getStories(page, limit)
    const next = stories && stories.length > 3 ? true : false

    return ((stories != undefined && stories.length) ?
        <Suspense>
            <div className="flex-col">
                <StoriesList page={page} stories={stories.slice(0, 3)} />
                <Navigation page={page} prev={prev} next={next} />
            </div>
        </Suspense> :
        <Loading />
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