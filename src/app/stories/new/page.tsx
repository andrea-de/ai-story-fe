"use client"

import Api from '@/app/helper/api';
import { redirect, useRouter } from 'next/navigation';

import React, { useState } from 'react';

export default function Page() {
    const router = useRouter()

    const [value, setValue] = useState({
        parts: 5, // parts of a story
        partLength: 30, // length in words of each part
        choices: 2, // choices after each part
        choicesLength: 5, // length of each choices
        creating: false // boolean describing form submission
    });

    const handleChange = (event: any) => {
        setValue(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setValue(prevState => ({
            ...prevState,
            "creating": true
        }));
        await new Promise((resolve) => {setTimeout(resolve, 1000)})
        router.push('justcreated');
    }

    return (
        <div>
            <h1>New Story</h1>
            {value.creating ? <div>loading</div> :
                <form className="w-5/6" onSubmit={handleSubmit} >
                    <div>
                        <label className='block my-5 font-semibold'>Prompt</label>
                        <textarea className="w-5/6 h-20 max-h-60 ml-5 p-2 resize-y shadow-lg rounded-md bg-secondary" />

                        <label className='block my-5 font-semibold'>Parts</label>
                        <input type="range" id="parts" name="parts" value={value.parts} onChange={handleChange} min="5" max="10" className="ml-5 accent-secondary" />
                        <span className='ml-5'>{value.parts}</span>

                        <label className='block my-5 font-semibold'>Choices</label>
                        <input type="range" id="choices" name="choices" value={value.choices} onChange={handleChange} min="2" max="4" className="ml-5 accent-secondary" />
                        <span className='ml-5'>{value.choices}</span>

                        <label className='block my-5 font-semibold'>Length</label>
                        <input type="range" id="partLength" name="partLength" value={value.partLength} onChange={handleChange} min="30" max="90" step="30" className="ml-5 accent-secondary" />
                        <span className='ml-5'>
                            {
                                value.partLength == 30 ? "Short" :
                                    value.partLength == 60 ? "Medium" :
                                        "Long"
                            }
                        </span>

                        <input type="submit" value="Submit" className='block text-lg mt-10 p-2 rounded-md shadow-lg bg-secondary hover:bg-tertiary' ></input>

                    </div>
                </form>
            }
        </div>
    )
}