import Link from "next/link";
import Api from "../helper/api";
import { Suspense } from "react";
import { GiOpenBook } from '@react-icons/all-files/gi/GiOpenBook';
import { FcReading } from '@react-icons/all-files/fc/FcReading';

const api = new Api();

export default async function StoriesPage({ searchParams }: { searchParams: { page: number } }) {
    let page: number = Number(searchParams.page) || 1;
    const stories: any[] = await api.getStories(page); // Gets one extra for pagination
    const prev = page > 1 ? true : false
    const next = stories.length > 3 ? true : false

    return (
        <Suspense fallback={<p>Loading data...</p>}>
            <div className="flex-col">
                <StoriesList page={page} stories={stories.slice(0, 3)} />
                <Navigation page={page} prev={prev} next={next} />
            </div>
        </Suspense>
    )
}

const StoriesList = async ({ stories, page = 1 }: { stories: any[], page: number }) => {
    return (
        <div className="max-h-[80%]">
            <h1 className="text-4xl text-center mr-10">Stories</h1>
            <div className="mb-5 overflow-y-scroll">
                {Object.keys(stories).length > 0 &&
                    (stories.map((story => (StoryCard(story)))))
                }
            </div>
        </div>
    )
}

const StoryCard = (story: any) => (
    // <Link href={'stories/' + story.tag}>
    <Link href={'stories/' + story.tag + '/' + '0'}>
        <div className="storycard w-[95%] my-4 p-3 pb-1 bg-secondary hover:bg-tertiary shadow-lg rounded-lg">
            <h3 className="text-lg font-bold">{story.name}</h3>
            <p className="line-clamp-2">{story.blurb}</p>
            <div className="flex justify-between items-center space-between italic">
                <Read read={3} />
                <Review score={3} />
            </div>
        </div>
    </Link>
);

const Review = async (props: { score: number }) => {
    let score = Math.round(Math.random() * 5)
    return (
        <div>
            <div className="flex">
                <span className="self-center" hidden>Score: &nbsp;&nbsp;</span>
                {Array.from({ length: score }, () => <div className="text-accent"><GiOpenBook size="23" /></div>)}
                {Array.from({ length: 5 - score }, () => <div className="text-primary"><GiOpenBook size="22" /></div>)}
            </div>
        </div>
    )
}

const Read = async (props: { read: number }) => {
    let read = Math.round(Math.random() * 30)
    return (
        <div>
            <div className="flex">
                <FcReading size="23" /><span>: &nbsp; {read} </span>
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