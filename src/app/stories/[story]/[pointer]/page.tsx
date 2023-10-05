"use client"

import Api from "@/app/helper/api";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, redirect, useParams } from 'next/navigation';

const api = new Api();

export default function Page() {
    const router = useRouter()
    const params = useParams();
    const tag = params.story.toString();
    const pointer = params.pointer.toString();
    if (!tag || !pointer) redirect('/');

    const scrollRef = useRef<HTMLDivElement>(null)

    type Story = {
        tag: string
        name: string
        segments: { [s: string]: string }
        choices: { [s: string]: string }
        pointer: string // position eg 1-2-1 & value of longers segments key
        loading: boolean
    };

    const [story, setValue]: [Partial<Story>, any] = useState({
        loading: true,
        tag: tag,
        pointer: pointer
    })

    const fetchStory = async () => {
        try {
            const story = await api.getStory(tag, pointer);
            setValue({
                ...story,
                loading: false,
                pointer: pointer
            });
        } catch (error: any) {
            if (error.name == 'PositionInvalid') router.push('/stories/' + tag + '/' + '0');
            else if (error.name == 'TagInvalid') router.push('/stories');
            // Error message
        }

    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        window.history.pushState({}, '', story.pointer);
    }, [story])
    
    const continueStory = async (position: string) => {
        // Validate
        if (!story.tag || !story.pointer) return 'Error: story not loaded';
        const action: number = parseInt(position.slice(-1), 10)

        // Loading
        setValue((prevState: any) => ({
            ...prevState,
            "loading": true
        }));

        // Get updates
        const updates = await api.sendStoryAction(story.tag, story.pointer, action)
        story.choices = updates.choices;
        story.segments = {
            ...story.segments,
            ...updates.segments
        }
        story.pointer += `-${action.toString()}`

        setValue({
            ...story,
            loading: false,
        });
    };

    return (
        <div>
            {story.name &&
                <div>
                    <h2 className="text-xl font-semibold ml-5">{story.name}</h2>
                    <div className="overflow-y-scroll story-segments mt-5 pr-3">
                        <div className="bg-white/10 rounded-md p-2">
                            {story.segments != undefined &&
                                Object.entries(story.segments).map(([position, segment]) => (
                                    <p className="mb-4" key={position}>{segment}</p>
                                ))
                            }
                        </div>
                        <div ref={scrollRef}></div>
                    </div>
                    {story.loading ?
                        <div className="loading font-bold mt-3">loading </div> :
                        <div className="w-[90%] ml-5">
                            {story.choices != undefined &&
                                Object.entries(story.choices).map(([position, choices]) => (
                                    <button
                                        onClick={() => continueStory(position)} // first choice 1 not 0 
                                        className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary hover:bg-tertiary" key={position}>
                                        {choices}
                                    </button>
                                ))
                            }
                            {JSON.stringify(story.choices) === JSON.stringify({}) &&
                                <div className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary">
                                    End of Story
                                </div>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    )
}


const Review = async () => {
    const stories: any = await api.getStories();
    return (
        <div>
            <div className="rate">
                <input type="radio" id="star5" name="rate" value="5" />
                <label htmlFor="star5" title="text">5 stars</label>
                <input type="radio" id="star4" name="rate" value="4" />
                <label htmlFor="star4" title="text">4 stars</label>
                <input type="radio" id="star3" name="rate" value="3" />
                <label htmlFor="star3" title="text">3 stars</label>
                <input type="radio" id="star2" name="rate" value="2" />
                <label htmlFor="star2" title="text">2 stars</label>
                <input type="radio" id="star1" name="rate" value="1" />
                <label htmlFor="star1" title="text">1 star</label>
            </div>
        </div>
    )
}