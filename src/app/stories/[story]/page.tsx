"use client"

import Api from "@/app/helper/api";
import React, { useEffect, useRef, useState } from 'react';
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";


const api = new Api();

export default function Page() {

    const params = useParams();
    const tag = params.story;
    if (!tag) redirect('/');
    else redirect(`/stories/${tag}/0`);

    const storyEndRef = useRef<HTMLDivElement>(null) // Scroll down to end of story

    const scrollToBottom = () => {
        storyEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const [story, setValue]: [Partial<Story>, any] = useState({
        loading: true,
        pointer: '0'
    })

    useEffect(() => {
        const fetchStory = async () => {
            // story is tag
            const story = await api.getStory(tag.toString());
            story.loading = false;
            setValue(story);
        }

        fetchStory();
        scrollToBottom();
    }, [])

    type Story = {
        name: string
        tag: string
        segments: string[]
        choices: string[]
        pointer: string // position eg 1-2-1
        loading: boolean
    };

    return (
        <div>
            {/* <h1></h1> */}
            {story.segments?.length && story.choices?.length &&
                <div className="">
                    <h2 className="text-xl font-semibold ml-5">{story.name}</h2>
                    <div className="overflow-y-scroll max-h-[500px] mt-5 pr-3">
                        <div className="bg-white/10 rounded-md p-2">
                            {story.segments.map(((part, i) => (
                                <p className="mb-4" key={i}>{part}</p>
                            )))}
                            <div ref={storyEndRef}></div>
                        </div>
                        <Link href={`/stories/${tag}/0`}>
                            <div className="mt-5 p-2 text-center shadow-lg rounded-md bg-secondary hover:bg-tertiary">Start</div>
                        </Link>
                    </div>
                </div>

            }
        </div>
    )
}

