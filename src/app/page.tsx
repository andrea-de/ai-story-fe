// import { redirect } from 'next/navigation'

// export default function Home() {
//   redirect('/about')
// }

'use client';

import { useChat, useCompletion } from 'ai/react';
import React, { useEffect, useState } from "react";

export default function Chat() {

    interface MyObject {
        [key: string]: string;
    }

    const [segments, setSegments] = useState<MyObject>({
        0: 'Introduction',
        1: 'First segment'
    });

    const [choices, setChoices] = useState<MyObject>({
        "1-1": 'First choice',
        "1-2": 'Second choice'
    });


    const completion = async (target: string) => {
        const targetValue = target; // Store target in a separate variable

        await fetch('/api/completion')
            .then((res) => res.body)
            .then(async (body) => {
                if (!body) return;
                const reader = body.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    console.log(targetValue);

                    const prevMyObject = {
                        [targetValue]: '', // Initialize it with an empty string or the appropriate initial value
                    };

                    const newChunk = Buffer.from(value).toString("utf-8");
                    setSegments((prevMyObject) => ({
                        ...prevMyObject,
                        [targetValue]: prevMyObject[targetValue] + newChunk, // Use targetValue here
                    }));
                }
            });

        console.log(segments);
    }

    const postAction = async (action: string) => {
        await completion(action)
        // query existing or instruction
        // query next segment
        // if (!end) query choice
        // if (!choices.length) query new choice
    }

    return (

        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <div className='segments h-full overflow-auto'>
                <div className="bg-secondary rounded-md p-2">
                    {Object.entries(segments).map(([position, segment]) => (
                        <p className="mb-4" key={position}>{segment}</p>
                    ))}
                </div>
                <div className="story-choices mr-5 mb-5">
                    {
                        Object.entries(choices).map(([choice, choices]) => (
                            <button onClick={() => postAction(choice)} // first choice 1 not 0 
                                className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-tertiary hover:bg-secondary" key={choice}>
                                {choices}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}