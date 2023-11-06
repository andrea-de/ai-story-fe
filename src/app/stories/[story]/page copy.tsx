"use client"

import { useEffect, useState, useRef, MouseEvent, Dispatch, SetStateAction } from "react";
import { useParams, useSearchParams } from 'next/navigation';
import { StreamingTextResponse } from 'ai';
import { useGlobalContext } from '@/app/context';
import Loading from '@/app/components/Loading';
import { Segment } from "./Segment";
import { Choice } from "./Choice";
import { Story } from "./Story";

export default function StoryPage() {
    const { userId, setPage, openStories, setOpenStories } = useGlobalContext();

    const params = useParams();
    const tag = params.story.toString();
    const loadUrl = '/api/story/' + tag;

    const searchParams = useSearchParams()
    let position = searchParams.get('position');

    const addPage = (story: Story, position: string) => {
        // Add to open stories
        const keys = Object.keys(openStories)
        const index = keys.findIndex((str) => str.includes(tag));
        const open = {
            [tag]: {
                title: story.name,
                position: position
            }
        }

        if (index == -1) { // New
            setOpenStories((stories) => {
                return { ...stories, ...open }
            });
        } else if (openStories[tag].position != position) { // Needs Update
            if (index == keys.length - 1) { // Update position in story
                console.log('update story position');
                setOpenStories((stories) => {
                    // stories.tag.position = position
                    return { ...stories, ...open }
                })
            } else {
                console.log('update navbar position');
                setOpenStories((stories) => { // Also update story position in navbar
                    delete stories.tag
                    return { ...stories, ...open }
                });
            }
        }

    }

    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = () => scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    const [story, setStory] = useState<Partial<Story>>({});
    const [isLoading, setLoading] = useState(true)

    const loadStory = async (position: string) => {
        try {
            const response = await fetch(loadUrl + '?position=' + position)
            if (!response.ok) throw new Error(response.statusText)
            const loadedStory = await response.json()
            setStory(loadedStory);
            setLoading(false)
            addPage(loadedStory, position)
        } catch (error: any) {
            console.error('Error loading story: ' + error.message)
        }
    }

    useEffect(() => { loadStory(position ?? '0') }, []);
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

        // Segment

        const stream = await generateSetSegment(story as Story, position)
        await streamSegment(position, stream, setStory)

        for (let pos of choicePositions) await generateSetChoice(story as Story, `${position}-${pos}`, setStory)

        // Finished Generation
        setLoading(false)
    }

    const regenerateChoice = async (position: string, event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setLoading(true)
        await generateSetChoice(story as Story, position, setStory)
        setLoading(false)
    }

    if (JSON.stringify(story) != '{}' && typeof story != "undefined") return (
        <div className="flex flex-col h-full max-w-xl mx-auto stretch text-justify">
            <h2 className="text-xl font-semibold ml-5 mb-5">{story.name}</h2>
            <div className="bg-secondary rounded-md shadow-lg p-2 overflow-auto grow-0">
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
            <div className="grow-1 mb-5">
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
            </div>
        </div>
    )
    return (
        <div className='loading'>Loading</div>
    )
}

const generateSetSegment = async (story: Story, target: string) => {
    const response = await fetch(`/api/completion`,
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

    if (!response.body) {
        throw new Error('Response body is null');
    }
    return response.body
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

async function streamSegment(target: string, stream: ReadableStream<Uint8Array>, setStory: Dispatch<SetStateAction<Partial<Story>>>) {
    const reader = stream.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const newChunk = Buffer.from(value).toString("utf-8");
        setStory((prevObject) => {
            const updatedSegments = { ...prevObject.segments };
            updatedSegments[target] = (updatedSegments[target] ?? '') + newChunk;
            const updatedObject = { ...prevObject, segments: updatedSegments };
            return updatedObject;
        });
    }
    throw new Error("Function not implemented.");
}
