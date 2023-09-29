"use client"

import Api from "@/app/helper/api";
import "./styles.css";
import React, { useEffect, useRef, useState } from 'react';

const staticStory = require('../../../static-story.json');

const api = new Api();

async function getStory() {
    // return api.getStories();
    // return staticStories;
}

export default function Page({ params }: { params: { story: string } }) {

    const storyEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        storyEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    const loadedStory = staticStory

    const [story, setValue]: [Story, any] = useState(loadedStory)

    useEffect(() => {
        const fetchStory = async () => {
            const storyload = await api.getStory(params.story.toString());
            console.log('story:: ', storyload);
            setValue(storyload);
            // console.log('loaded story: ' + loadedStory2);
        }

        fetchStory();
        scrollToBottom();
    })


    type Story = {
        story: string[],
        loading: boolean,
        choices: string[],
        name: string
    };


    const continueStory = async (hey: any, event: any) => {
        setValue((prevState: any) => ({
            ...prevState,
            "loading": true
        }));
        await new Promise((resolve) => { setTimeout(resolve, 1000) })
        storyUpdate();
    };

    const storyUpdate = async () => {
        const fetchedStory = { ...loadedStory };
        fetchedStory.story.push('another part of the story');
        setValue(fetchedStory);
        scrollToBottom()
    }

    return (
        <div>
            {/* <h1></h1> */}
            <div className="">
                <h2 className="text-xl font-semibold ml-5">{story.name}</h2>
                <div className="overflow-y-scroll max-h-[500px] mt-5 pr-3">
                    <div className="bg-white/10 rounded-md p-2">
                        {story.story.map(((part, i) => (
                            <p className="mb-4" key={i}>{part}</p>
                        )))}
                        <div ref={storyEndRef}></div>
                    </div>
                </div>
                {story.loading ?
                    <div className="loading font-bold mt-3">loading </div> :
                    <div className="w-[90%] ml-5">
                        {story.choices.map(((choices, i) => (
                            <button onClick={(event) => continueStory(i, event)} className="mt-5 p-2 w-full text-left shadow-lg rounded-md bg-secondary hover:bg-tertiary" key={i}>{choices}</button>
                        )))}
                    </div>
                }
            </div>
        </div>
    )
}

