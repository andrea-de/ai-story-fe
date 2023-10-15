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
        <div className="flex-col max-w-2xl mx-10 h-full">
            <h1 className="text-4xl text-center mr-10">Stories</h1>
            <StoriesList page={page} stories={stories.slice(0, 3)} />
            <Navigation page={page} prev={prev} next={next} />
        </div>
        :
        <Loading />
    )
}

const StoriesList = async ({ stories, page = 1 }: { stories: any[], page: number }) => {
    return (
        <div className="grow shrink-0 max-h-[80%] story-list overflow-y-scroll my-5">
            {Object.keys(stories).length > 0 &&
                (stories.map((story => (StoryCard(story)))))
            }
        </div>
    )
}

const Navigation = async ({ page = 1, prev, next }: { page: number, prev: boolean, next: boolean }) => {
    return (
        <div className="w-full basis-4 flex justify-around max-w-[95%]">
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