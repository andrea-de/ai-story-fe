"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGlobalContext } from '../context';
import { Form } from './Form'
import { Story } from './Story'
import NewStoryForm from './NewStoryForm'
import NewStory from './NewStory'
import './new.css'

export default function Page() {
    const router = useRouter()

    const { userId } = useGlobalContext();

    const defaultForm = {
        description: '', // required story description
        instruction: '', // optional instruction
        parts: 5, // parts of a story
        choices: 2, // choices after each part
        length: 'short' // 
    }

    const [form, setForm] = useState<Form>(defaultForm);
    const [newStory, setNewStory] = useState<Partial<Story>>({})
    const [generateEnabled, toggleGenerate] = useState(true); // Prevents spamming OpenAI API
    const [submitEnabled, toggleSubmit] = useState(true); // Prevents spamming OpenAI API

    const handleFormChange = (event: any) => {
        setForm(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleGenerateDescription = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            toggleGenerate(false);
            await generateDescription(form as Form, setForm)
            toggleGenerate(true);
        } catch (error: any) {
            alert(error.message)
            toggleGenerate(true);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            toggleSubmit(false)
            toggleGenerate(false)
            await generate('title', form as Form, setNewStory)
            await generate('tag', form as Form, setNewStory)
            const intro = await generate('introduction', form as Form, setNewStory)
            await generateChoices(form as Form, intro, setNewStory)
            toggleSubmit(true)
            toggleGenerate(true)
        } catch (error: any) {
            console.error(error)
            setNewStory({})
            toggleSubmit(true)
            toggleGenerate(true)
        }
    }

    const handleClear = async (event: React.FormEvent) => {
        event.preventDefault();
        setForm(defaultForm)
    }

    const handlePlayStory = async () => {
        await saveStory(form, newStory as Story)
        const play = document.querySelector('#play') as HTMLInputElement | HTMLButtonElement;
        if (play) play.disabled = true
        router.push('/stories/' + newStory.tag);
    }

    return (
        <div className='overflow-y-scroll w-[80svw] max-w-2xl'>
            {!newStory.title ?
                <NewStoryForm
                    form={form}
                    handleFormChange={handleFormChange}
                    generateEnabled={generateEnabled}
                    handleGenerate={handleGenerateDescription}
                    handleSubmit={handleSubmit}
                    submitEnabled={submitEnabled}
                    handleClear={handleClear}
                />
                :
                <NewStory 
                    form={form as Form} 
                    newStory={newStory as Story} 
                    setStory={setNewStory} 
                    playStory={handlePlayStory}
                />
            }
        </div>
    )
}

const generateDescription = async (form: Form, setValue: any) => {
    setValue((prevState: Form) => {
        prevState.description = ''
        return prevState
    });

    await fetch('/api/generate', { cache: 'no-store' })
        .then((res) => res.body)
        .then(async (stream) => {
            if (!stream) return;
            const reader = stream.getReader();
            let description = ''

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const newChunk = Buffer.from(value).toString("utf-8").replace(/\"/g, ' ');
                description += newChunk
                setValue({
                    ...form,
                    description: description
                });
            }
        });
}

const generate = async (target: string, form: Form, setNewStory: any) => {
    let final = ''

    await fetch('/api/generate',
        {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                generate: target,
                description: form.description,
                instruction: form.instruction,
            })
        })
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText)
            else return res.body
        })
        .then(async (stream) => {
            if (!stream) return;
            const reader = stream.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const newChunk = Buffer.from(value).toString("utf-8").replace(/\"/g, '');

                setNewStory((prevObject: any) => {
                    const newObject = { ...prevObject };
                    final += newChunk
                    newObject[target] = final
                    return newObject;
                });

            }
        })
    return final
}

const generateChoices = async (form: Form, introduction: string, setNewStory: any) => {
    const choices: string[] = []

    for (let i = 0; i < form.choices; i++) {
        await fetch('/api/generate',
            {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generate: 'choice',
                    description: form.description,
                    instruction: form.instruction,
                    introduction: introduction,
                    choices: choices.filter(c => c != '')
                })
            })
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText)
                else return res.body
            }).then(async (stream) => {
                if (!stream) return;
                const reader = stream.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const newChunk = Buffer.from(value).toString("utf-8").replace(/\"/g, '');

                    setNewStory((prevObject: any) => {
                        const newObject = { ...prevObject };
                        choices[i] = (choices[i] ?? '') + newChunk
                        newObject.choices = choices
                        return newObject;
                    });

                }
            })
    }
}

const saveStory = async (form: Form, newStory: Story) => {
    const choices: { [key: string]: any } = {};
    for (let i = 1; i < newStory.choices.length + 1; i++) {
        choices[i.toString()] = newStory.choices[i-1]
    }

    await fetch('/api/new',
        {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: form.description,
                instruction: form.instruction,
                parts: form.parts,
                choicesLength: form.choices,
                // form length
                name: newStory.title,
                tag: newStory.tag,
                segments: { "0": newStory.introduction },
                choices: choices
            })
        })
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText)
            return res
        });
}