import Link from "next/link";
import { GiOpenBook } from '@react-icons/all-files/gi/GiOpenBook';
import { FcReading } from '@react-icons/all-files/fc/FcReading';
import './storycard.css'

export default function StoryCard(story: any) {
    return (
        <Link href={'stories/' + story.tag}>
            <div className="storycard max-w-[95%] my-4 p-3 pb-1 bg-secondary hover:bg-tertiary shadow-lg rounded-lg">
                <h3 className="text-lg font-bold">{story.name}</h3>
                <p className="line-clamp-2">{story.blurb}</p>
                <div className="flex justify-between items-center space-between italic">
                    <Read read={3} />
                    <Review score={3} />
                </div>
            </div>
        </Link>
    )
}

const Review = async (props: { score: number }) => {
    let score = Math.round(Math.random() * 5)
    return (
        <div>
            <div className="flex">
                <span className="self-center" hidden>Score: &nbsp;&nbsp;</span>
                {Array.from({ length: score }, (_, index) =>
                    <div key={index} className="">
                        <GiOpenBook className="review-icon" />
                    </div>
                )}
                {Array.from({ length: 5 - score }, (_, index) =>
                    <div key={index} className="text-primary">
                        <GiOpenBook className="review-icon" />
                    </div>
                )}
            </div>
        </div>
    )
}

const Read = async (props: { read: number }) => {
    let read = Math.round(Math.random() * 30)
    return (
        <div>
            <div className="flex">
                <FcReading className="review-icon" /><span>: &nbsp; {read} </span>
            </div>
        </div>
    )
}
