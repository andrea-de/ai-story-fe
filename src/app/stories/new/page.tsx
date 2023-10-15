"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImHourGlass } from '@react-icons/all-files/im/ImHourGlass';
import { useState } from 'react';
import Loading from '@/app/components/Loading';
import './new.css'

export default function Page() {
    const [form, setValue] = useState({
        description: '',
        parts: 5, // parts of a story
        choices: 2, // choices after each part
        length: 'short', // 
        creating: false // boolean describing form submission
    });

    const [newStory, setNewStory] = useState<Partial<{ tag: string, title: string, ready: boolean }>>({ ready: false })
    const [generateDisabled, toggleDisabled] = useState(false); // Prevents spamming OpenAI API

    const handleFormChange = (event: any) => {
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
            const response = await fetch('/api/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            if (!response.ok) throw new Error(response.statusText)
            const createdResponse = await response.json()

            setNewStory({ ...createdResponse, ready: false })
            setTimeout(() => setNewStory({ ready: true, ...createdResponse }), 15000)
        } catch (error: any) {
            alert(error.message)
            setValue(prevState => ({
                ...prevState,
                "creating": false
            }));
        }
    }

    const handleGenerate = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            toggleDisabled(prevState => !prevState);
            const response = await fetch('/api/generate', { cache: 'no-store' });
            if (!response.ok) throw new Error(response.statusText)
            const description = await response.json().then(res => res.description)
            setValue(prevState => ({
                ...prevState,
                "description": description
            }));
            toggleDisabled(prevState => !prevState);
        } catch (error: any) {
            alert(error.message)
            toggleDisabled(prevState => !prevState);
        }
    }

    return (
        !newStory.title ?
            <div>
                <h1 className='text-3xl'>New Story</h1>
                {
                    form.creating ?
                        <div className="loading font-bold mt-3">Loading</div>
                        :
                        <form className="" onSubmit={handleSubmit} >
                            <div>
                                <label className='block my-5 font-semibold'>Description</label>
                                <textarea name="description" value={form.description} onChange={handleFormChange} maxLength={500}
                                    className="w-full h-28 max-h-52 ml-5 p-2 resize-y shadow-lg rounded-md bg-secondary">
                                </textarea>

                                <button onClick={handleGenerate} disabled={generateDisabled}
                                    className='text-sm mt-2 ml-5 mb-3 p-2 rounded-md shadow-lg disabled:bg-gray-300 focus:outline-none bg-secondary hover:bg-tertiary'>Generate</button>

                                <div className='form-options ml-5 mt-5'>
                                    <div className='flex'>
                                        <label className='font-semibold'>Parts</label>
                                        <input type="range" id="parts" name="parts" value={form.parts} onChange={handleFormChange} min="4" max="7" className="ml-5 accent-secondary" />
                                        <span className='ml-5 mr-10 font-bold italic'>{form.parts}</span>
                                    </div>

                                    <div className='flex'>
                                        <label className='font-semibold'>Choices</label>
                                        <input type="range" id="choices" name="choices" value={form.choices} onChange={handleFormChange} min="2" max="4" className="ml-5 accent-secondary" />
                                        <span className='ml-5 font-bold italic'>{form.choices}</span>
                                    </div>
                                </div>

                                <div className="form-options radial-input ml-5 mt-5">
                                    <p>
                                        <span className='font-semibold mr-8'>Story Length: </span>
                                        <span className='mr-8 w-10 font-semibold italic'>{`${form.length.charAt(0).toUpperCase()}${form.length.slice(1)}`}</span>
                                    </p>
                                    <div className='flex gap-3'>
                                        {['short', 'medium', 'long'].map((e, i) =>
                                        (
                                            <div key={i}>
                                                <input type="radio" id={e} name="length" checked={form.length === e} onChange={handleFormChange} value={e} hidden />
                                                <label htmlFor={e} className={`text-white w-10 h-10 bg-secondary hover:bg-white hover:text-secondary rounded-lg text-center flex justify-center items-center ${form.length === e ? 'bg-white' : ''}`}>
                                                    <ImHourGlass className={form.length === e ? 'text-secondary' : ''} size={20 + 5 * i} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <input type="submit" value="Submit" className='block text-lg mt-8 p-2 rounded-md shadow-lg bg-secondary hover:bg-tertiary' ></input>

                            </div>
                        </form>
                }
            </div>
            :
            <div>
                <dialog open className='fixed top-24 p-6 rounded-md text-lg border-4 border-white bg-background shadow-lg text-white'>
                    <span>Story Created</span> : <span>{newStory.title}</span>
                    <div className='mt-5  text-center'>
                        <div className='mt-7 font-bold'>
                            {newStory.ready ?
                                <Link href={`/stories/${newStory.tag}`} >
                                    <span className='p-3 bg-secondary hover:bg-tertiary rounded-lg'>Go!</span>
                                </Link>
                                :
                                <Loading />
                            }
                        </div>
                    </div>
                </dialog>
            </div>
    )
}