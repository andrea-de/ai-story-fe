"use client"

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, redirect, useParams } from 'next/navigation';
import Loading from '@/app/components/Loading';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const tag = params.story.toString();
    const url = '/api/story/' + tag

    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = () => scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    type Story = {
        tag: string
        name: string
        segments: { [s: string]: string }
        choices: { [s: string]: string }
    };

    const [loading, setLoading] = useState(true)
    const [story, setStory] = useState<Story | undefined>(undefined)
    const [position, setPosition] = useState('0')

    const loadStory = async () => {
        try {
            const storyResponse = await fetch(url + '?position=' + position)
            if (!storyResponse.ok) throw new Error(storyResponse.statusText)
            const loaded = await storyResponse.json()
            if (loaded.error) throw loaded.error
            setStory(loaded);
        } catch (error: any) {
            alert(error.message)
            router.push('/stories/' + tag);
        }
    }

    const postAction = async (action: string) => {
        try {
            setLoading(true)
            const actionResponse = await fetch(url,
                {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: action
                    })
                })
            if (!actionResponse.ok) throw new Error(actionResponse.statusText)
            if (position != action) setPosition(action)
        } catch (error: any) {
            alert(error.message)
            setLoading(false)
        }
    }

    useEffect(() => { loadStory() }, [position]) // Story loads on position change
    useEffect(() => { setLoading(false) }, [story]) // Loaded reacts to story change
    useEffect(() => { scroll() }, [loading]) // Scroll position on loaded

    async function rewindStory() {
        const previous = position.length == 1 ? '0' : position.slice(0, -2)
        setPosition(previous)
    }

    return (
        <div>
            {story && story.name ?
                <div>
                    <h2 className="text-xl font-semibold ml-5">{story.name}</h2>
                    <div className="max-h-[calc(60svh)] overflow-y-scroll story-segments mt-5 pr-3">
                        <div className="bg-secondary rounded-md p-2">
                            {story.segments != undefined &&
                                Object.entries(story.segments).map(([position, segment]) => (
                                    <p className="mb-4" key={position}>{segment}</p>
                                ))
                            }
                        </div>
                        <div ref={scrollRef}></div>
                    </div>
                    {loading ?
                        <div className='mt-5'>
                            <Loading />
                        </div>
                        :
                        <div className="w-[90%] ml-5">
                            {story.choices != undefined &&
                                Object.entries(story.choices).map(([choice, choices]) => (
                                    <button onClick={() => postAction(choice)} // first choice 1 not 0 
                                        className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-tertiary hover:bg-secondary" key={choice}>
                                        {choices}
                                    </button>
                                ))
                            }
                            {JSON.stringify(story.choices) === JSON.stringify({}) &&
                                <div className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary">
                                    End of Story
                                </div>
                            }
                            {position != '0' &&
                                <button onClick={() => rewindStory()}
                                    className="mt-6 p-2 min-w-fit bg-red-400 hover:bg-secondary rounded-lg">
                                    Back
                                </button>
                            }
                        </div>
                    }
                </div>
                :
                <Loading />            }
        </div>
    )
}


const Review = async () => {
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