"use client"

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Loading from '@/app/components/Loading';
import './story.css'

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

    const [loadingState, setLoading] = useState('loaded')
    const [story, setStory] = useState<Story | undefined>(undefined)
    const [position, setPosition] = useState('0')
    const [action, setAction] = useState('')

    const loadStory = async (attempts: number = 0) => {
        try {
            if (attempts) await new Promise(res => { setTimeout(res, 5000) })
            const storyResponse = await fetch(url + '?position=' + position)
            // const storyResponse = await fetch(url + '?position=' + '1-1-1-1-1')
            if (!storyResponse.ok) throw new Error(storyResponse.statusText)
            const loaded = await storyResponse.json()
            if (loaded.error) throw loaded.error
            setStory(loaded);
        } catch (error: any) {
            if (attempts > 0) await loadStory(attempts - 1)
            console.error('Error loading story' + error.message)
            rewindStory()
        }
    }

    const postAction = async (action: string) => {
        try {
            setAction(action)
            setLoading('Loading')
            const actionResponse = await fetch(url,
                {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: action
                    })
                })
            if (!actionResponse.ok) throw new Error(actionResponse.statusText)
            const { generated } = await actionResponse.json()
            if (generated) {
                console.log('Story Generating in Server');
                setLoading('Generating')
                setTimeout(() => setPosition(action), 15000)
            }
            else setPosition(action)
        } catch (error: any) {
            console.error('Error posting action' + error.message)
        }
    }

    useEffect(() => {
        if (loadingState != 'Generating') loadStory()
        else loadStory()
    }, [position]) // Story loads on position change
    useEffect(() => { setLoading('Loaded') }, [story]) // Loaded reacts to story change
    useEffect(() => { scroll() }, [loadingState]) // Scroll position on loaded

    async function rewindStory() {
        const previous = position.length == 1 ? '0' : position.slice(0, -2)
        setPosition(previous)
    }

    return (
        <div className="max-w-3xl max-w-[80%] h-full">
            {story && story.name ?
                <div className='story h-full'>
                    <h2 className="text-xl font-semibold ml-5">{story.name}</h2>
                    <div className="story-segments overflow-y-scroll mt-5 pr-3">
                        <div className="bg-secondary rounded-md p-2">
                            {story.segments != undefined &&
                                Object.entries(story.segments).map(([position, segment]) => (
                                    <p className="mb-4" key={position}>{segment}</p>
                                ))
                            }
                        </div>
                        <div ref={scrollRef}></div>
                    </div>
                    {loadingState == 'Loaded' ?
                        <div className="story-choices mr-5 mb-5">
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
                                    The End
                                </div>
                            }
                            {position != '0' &&
                                <button onClick={() => rewindStory()}
                                    className="mt-6 p-2 min-w-fit bg-red-400 hover:bg-secondary rounded-lg">
                                    Back
                                </button>
                            }
                        </div>
                        :
                        <div className='story-choices mr-5 mb-5'>
                            <div className="my-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary">
                                {story.choices[action]}
                            </div>
                            <Loading text={loadingState} />
                        </div>
                    }
                </div>
                :
                <Loading />}
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