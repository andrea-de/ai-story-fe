import { Suspense } from "react";
import { getStories } from "../helper/actions";
import Link from "next/link";
import StoryCard from "../components/StoryCard";
import Loading from "../components/Loading";

export default async function StoriesPage({ searchParams }: { searchParams: { page: number } }) {
    const page: number = Number(searchParams.page) || 1;
    const prev = page > 1 ? true : false
    const limit = 5;
    const stories = await getStories(page, limit)
    const next = stories && stories.length > limit ? true : false

    return ((stories != undefined && stories.length) ?
        <div className="flex flex-col max-w-2xl mx-5 pb-5 h-full">
            <h1 className="text-3xl text-center">Stories</h1>
            <StoriesList page={page} stories={stories.slice(0, limit)} />
            <div className="grow"></div>
            <Navigation page={page} prev={prev} next={next} />
        </div>
        :
        <Loading />
    )
}

const StoriesList = async ({ stories, page = 1 }: { stories: any[], page: number }) => {
    return (
        <div className="grow h-[75%] overflow-y-scroll py-5">
            {Object.keys(stories).length > 0 &&
                (stories.map((story => (
                    <div key={story.tag}>{StoryCard(story)}</div>
                ))))
            }
        </div>
    )
}

const Navigation = async ({ page = 1, prev, next }: { page: number, prev: boolean, next: boolean }) => {
    return (
        <div className="w-full basis-4 flex justify-around h-[10%]">
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