"use client"

import { useEffect, useState, useRef, MouseEvent } from "react";
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { IoShareSocial } from '@react-icons/all-files/io5/IoShareSocial';

import Loading from '@/app/components/Loading';
import { useGlobalContext } from '@/app/context';
import { Story } from "./Story";
import { Segment } from "./Segment";
import { Choice } from "./Choice";

export default function StoryPage() {
    const { openStories, amendOpenStories } = useGlobalContext();

    const router = useRouter()
    const params = useParams();
    const tag = params.story.toString();
    const loadUrl = '/api/story/' + tag;

    const searchParams = useSearchParams()

    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = () => scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    const [story, setStory] = useState<Partial<Story>>({});
    const [isLoading, setLoading] = useState(true)
    const [position, setPosition] = useState(searchParams.get('position') ?? '0')

    useEffect(() => router.push('?position=' + position), [position])
    useEffect(() => { if (story.name) amendOpenStories(tag, position, story.name) }, [story])

    const loadStory = async (position: string) => {
        try {
            const response = await fetch(loadUrl + '?position=' + position)
            if (!response.ok) throw new Error(response.statusText)
            const loadedStory = await response.json()
            setStory(loadedStory);
            setLoading(false)
            setPosition(position)
            // addPage(loadedStory.name, position)
        } catch (error: any) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => { loadStory(position) }, []);
    useEffect(() => { scroll() }, [isLoading]);
    useEffect(() => { scroll() }, [story]) // Loaded reacts to story change

    const goBack = async () => {
        const segmentKeys = Object.keys(story.segments ?? { "1": "" })
        const position =
            segmentKeys.slice(-1)[0].length == 1 ? '0' : // if on position 1
                segmentKeys.slice(-1)[0].slice(0, -2) // if on position 2 and up 
        loadStory(position)
    }

    const generateAtPosition = async (position: string) => { // User action
        // Choices to generate
        setLoading(true)
        const choicePositions = story.choices ? Object.keys(story.choices).map(pos => pos.slice(-1)) : []

        // Clear artifacts
        setStory((prevStory) => {
            if (!prevStory || !prevStory.segments) return prevStory;
            delete prevStory.segments[position]
            prevStory.choices = {}
            prevStory.regenerate = true
            return prevStory;
        });

        // Generate segment and choices
        await generateSetSegment(story as Story, position, setStory)
        for (let pos of choicePositions) await generateSetChoice(story as Story, `${position}-${pos}`, setStory)

        // Finished Generation
        setLoading(false)
        setPosition(position)
        router.push('?position=' + position)
    }

    const regenerateChoice = async (position: string, event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setLoading(true)
        await generateSetChoice(story as Story, position, setStory)
        setLoading(false)
    }

    return (
        <div className="w-[80svw] max-w-2xl">
            {(JSON.stringify(story) != '{}' && typeof story != "undefined") ?
                <div className="flex flex-col h-full">
                    <button hidden className='fixed top-0 right-0 m-3 p-2 rounded-md bg-white text-slate-800' onClick={() =>
                        console.log(isLoading)
                    }>do stuff</button>
                    <h2 className="text-xl font-semibold ml-5 mb-5 flex-none">{story.name}</h2>
                    <div className="bg-secondary rounded-md shadow-lg p-2 overflow-auto">
                        {story.segments &&
                            Object.entries(story.segments).map(([position, segment]) =>
                                <Segment
                                    segment={segment}
                                    segmentKey={position}
                                    key={position}
                                    isLoading={isLoading}
                                    regenerate={(story.regenerate && Object.keys(story.segments ?? []).slice(-1)[0] == position) ? generateAtPosition : undefined}
                                />
                            )
                        }
                        <div ref={scrollRef}></div>
                    </div>
                    <div className="flex-auto">
                        {story.choices &&
                            Object.entries(story.choices).map(([choiceKey, choice]) => {
                                const ready = story.ready?.includes(choiceKey);
                                return (
                                    <Choice
                                        choice={choice}
                                        choiceKey={choiceKey}
                                        ready={ready}
                                        action={ready ? loadStory : generateAtPosition}
                                        regenerate={story.regenerate != undefined ? regenerateChoice : undefined}
                                        key={choiceKey} isLoading={isLoading}
                                    />
                                )
                            })}
                        {isLoading &&
                            <div className="mt-5 p-2 w-full">
                                <Loading />
                            </div>
                        }
                        {Object.values(story.choices ?? {}).length < 1 && !isLoading && // No choices and no choices being generated
                            // THE END
                            <div className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary">
                                The End
                            </div>
                        }
                        {Object.values(story.segments ?? []).length > 1 && !isLoading && // Not at start and no choices being generated
                            // NAVIGATE BACK
                            <button onClick={() => goBack()}
                                className="mt-6 p-2 min-w-fit bg-red-400 hover:bg-secondary rounded-lg">
                                Back
                            </button>
                        }
                        <button
                            className="mt-5 p-2 w-fit float-right text-left text-lg shadow-lg rounded-md bg-secondary"
                        >
                            Share &nbsp;<IoShareSocial className="inline" />
                        </button>
                    </div>
                    <div className="grow"></div>
                </div>
                :
                <div className='loading'>Loading</div>
            }
        </div>
    )
}

const generateSetSegment = async (story: Story, target: string, setStory: any) => {
    // Clear Segment
    setStory((prevObject: Story) => {
        prevObject.segments[target] = ''
        return prevObject;
    });

    await fetch(`/api/completion`,
        {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tag: story.tag,
                position: target,
                segments: Object.values(story.segments),
                choice: story.choices[target],
                action: 'generate-segment'
            })
        })
        .then((res) => res.body)
        .then(async (stream) => {
            if (!stream) return;
            const reader = stream.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const newChunk = Buffer.from(value).toString("utf-8");
                setStory((prevObject: { segments: any; }) => {
                    const updatedSegments = { ...prevObject.segments };
                    updatedSegments[target] = (updatedSegments[target] ?? '') + newChunk;
                    const updatedObject = { ...prevObject, segments: updatedSegments };
                    return updatedObject;
                });
            }
        });
}

const generateSetChoice = async (story: Story, target: string, setStory: any) => {
    // Clear Choice
    setStory((prevObject: { choices: any; }) => {
        prevObject.choices[target] = ''
        return prevObject;
    });

    await fetch(`/api/completion`,
        {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tag: story.tag,
                position: target,
                segments: Object.values(story.segments),
                choices: Object.values(story.choices),
                action: 'generate-choices'
            })
        })
        .then((res) => res.body)
        .then(async (stream) => {
            if (!stream) return;
            const reader = stream.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const newChunk = Buffer.from(value).toString("utf-8");
                setStory((prevObject: { choices: any; }) => {
                    const updatedChoices = { ...prevObject.choices };
                    updatedChoices[target] = (updatedChoices[target] ?? '') + newChunk;
                    const updatedObject = { ...prevObject, choices: updatedChoices };
                    return updatedObject;
                });
            }
        });
}