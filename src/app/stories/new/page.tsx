"use client"

import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const router = useRouter()

    type Create = {
        name: string,
        prompt: string,
        tag: string,
        parts: number,
        choices: number,
    }

    const [form, setValue] = useState({
        description: '',
        parts: 5, // parts of a story
        choices: 2, // choices after each part
        // partLength: 30, // length in words of each part
        // choicesLength: 5, // length of each choices
        creating: false // boolean describing form submission
    });

    const handleChange = (event: any) => {
        setValue(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            setValue(prevState => ({
                ...prevState,
                "creating": true
            }));

            const { creating, ...requestBody } = form;
            const response = await fetch('api/new', {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }).then(res => res.json());
            const tag = response.tag;
            router.push(tag);
        } catch (error) {
            // handle error popup indiacting genration not successful
            setValue(prevState => ({
                ...prevState,
                "creating": false
            }));
        }
    }

    const [generateDisabled, toggleDisabled] = useState(false);

    const handleGenerate = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            toggleDisabled(prevState => !prevState);
            const response = await fetch('api/generate', { cache: 'no-store' });
            if (!response.ok) throw new Error('Something went wrong');
            const description = await response.json().then(res => res.description)
            setValue(prevState => ({
                ...prevState,
                "description": description
            }));
            toggleDisabled(prevState => !prevState);
        } catch (error) {
            // handle error popup indiacting genration not successful
            toggleDisabled(prevState => !prevState);
        }
    }

    return (
        <div>
            <h1>New Story</h1>
            {form.creating ? <div>loading</div> :
                <form className="" onSubmit={handleSubmit} >
                    <div>
                        <label className='block my-5 font-semibold'>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} maxLength={500}
                            className="w-full h-28 max-h-52 ml-5 p-2 resize-y shadow-lg rounded-md bg-secondary"></textarea>

                        <button onClick={handleGenerate} disabled={generateDisabled}
                            className='text-sm mt-2 ml-5 mb-3 p-2 rounded-md shadow-lg disabled:bg-gray-300 focus:outline-none bg-secondary hover:bg-tertiary'>Generate</button>

                        {/* <label className='block my-5 font-semibold'>Tag (unique)</label>
                        <input name="tag" value={form.tag} onChange={handleChange}
                        className="ml-5 p-2 shadow-lg rounded-md bg-secondary" /> */}

                        <div className='form-options ml-5 mt-5'>
                            <div className='flex'>
                                <label className='font-semibold'>Parts</label>
                                <input type="range" id="parts" name="parts" value={form.parts} onChange={handleChange} min="5" max="10" className="ml-5 accent-secondary " />
                                <span className='ml-5 mr-10'>{form.parts}</span>
                            </div>

                            <div className='flex'>
                                <label className='font-semibold'>Choices</label>
                                <input type="range" id="choices" name="choices" value={form.choices} onChange={handleChange} min="2" max="4" className="ml-5 accent-secondary" />
                                <span className='ml-5'>{form.choices}</span>
                            </div>
                        </div>

                        {/* <label className='block my-5 font-semibold'>Length</label>
                        <input type="range" id="partLength" name="partLength" value={form.partLength} onChange={handleChange} min="30" max="90" step="30" className="ml-5 accent-secondary" />
                        <span className='ml-5'>
                            {
                                form.partLength == 30 ? "Short" :
                                    form.partLength == 60 ? "Medium" :
                                        "Long"
                            }
                        </span> */}

                        <input type="submit" value="Submit" className='block text-lg mt-10 p-2 rounded-md shadow-lg bg-secondary hover:bg-tertiary' ></input>

                    </div>
                </form>
            }
        </div>
    )
}