"use client"

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, redirect, useParams } from 'next/navigation';

export default function Page() {
    const router = useRouter()
    const params = useParams();
    // console.log('params: ', params);
    const tag = params.story.toString();
    // console.log('tag: ', tag);
    // const url = new URL(`stories/api/story`, window.location.origin).toString();
    const url = 'stories/api/story'

    // const pointer = params.pointer.toString();
    // const pointer = 0
    if (!tag) redirect('/');

    const scrollRef = useRef<HTMLDivElement>(null)

    type Story = {
        tag: string
        name: string
        segments: { [s: string]: string }
        choices: { [s: string]: string }
        pointer: string // position eg 1-2-1 & value of longers segments key
        previous: string
        loading: boolean
    };

    const [loading, setLoading] = useState(true)
    const [position, setPosition] = useState('0')
    const [story, setStory] = useState<Story | undefined>(undefined)

    // const [story, setValue]: [Partial<Story>, any] = useState({
    //     loading: true,
    //     tag: tag,
    // })

    const fetchStory = async (pointer: string = position) => {
        try {
            // const getUrl = url + `?tag=${tag}&pointer=${pointer}`;
            // console.log('getUrl: ', 'getUrl');
            const st = await fetch('api/story').then(res => res.json());
            console.log('story: ', st);
            return st
        } catch (error: any) {
            console.log(error);
            if (error.name == 'PositionInvalid') router.push('/stories/' + tag + '/' + '0');
            else if (error.name == 'TagInvalid') router.push('/stories');
            // Error message
        }
    }

    const postStory = async (action: string) => {
        try {
            const story = await fetch(url,
                {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tag: tag,
                        position: position,
                        action: action
                    })
                }).then(res => res.json());
            return story
        } catch (error) {
            // Error message
        }
    }

    useLayoutEffect(() => {
        fetchStory(tag)
            .then((story) => {
                setStory(story);
                setLoading(false);
            })
            .catch((err)=>{console.log(err);})
    });

    // useEffect(() => {
    //     scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    //     // window.history.pushState({}, '', story.pointer);
    // }, [story])

    async function continueStory(action: string) {
        setLoading(true)
        const story = await postStory(action)
        setPosition('')
        setStory(story);
        setLoading(false)
    };
    // http://localhost:3000/stories/insane-detective-risks-truth-eclipse-disappearances/stories/api/story?tag=insane-detective-risks-truth-eclipse-disappearances&pointer=insane-detective-risks-truth-eclipse-disappearances

    async function rewindStory(tag: string, pointer: string) {
        setLoading(true)
        const story = await fetchStory()
        setPosition(story.position)
        setStory(story);
        setLoading(false)
    }

    return (
        <div>
            {story && story.name &&
                <div>
                    <h2 className="text-xl font-semibold ml-5">{story.name}</h2>
                    <div className="max-h-[calc(60svh)] overflow-y-scroll story-segments mt-5 pr-3">
                        <div className="bg-white/10 rounded-md p-2">
                            {story.segments != undefined &&
                                Object.entries(story.segments).map(([position, segment]) => (
                                    <p className="mb-4" key={position}>{segment}</p>
                                ))
                            }
                        </div>
                        <div ref={scrollRef}></div>
                    </div>
                    {loading ?
                        <div className="loading font-bold mt-3">loading </div> :
                        <div className="w-[90%] ml-5">
                            {story.choices != undefined &&
                                Object.entries(story.choices).map(([choice, choices]) => (
                                    <button
                                        onClick={() => continueStory(choice)} // first choice 1 not 0 
                                        className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary hover:bg-tertiary" key={choice}>
                                        {choices}
                                    </button>
                                ))
                            }
                            {JSON.stringify(story.choices) === JSON.stringify({}) &&
                                <div className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary">
                                    End of Story
                                </div>
                            }
                            {!loading && story.previous &&
                                <button
                                    className="mt-5 p-2 min-w-fit bg-secondary hover:bg-tertiary"
                                    onClick={() => rewindStory(tag, story.previous)}
                                >
                                    hello
                                </button>
                            }
                        </div>
                    }
                </div>
            }
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