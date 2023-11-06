import { Story } from "./Story"
import { Form } from "./Form"
import Loading from '../components/Loading';

interface NewStoryProps {
    form: Form,
    newStory: Story,
    setStory: any,
    playStory: any
}

export default function NewStory({ form, newStory, setStory, playStory }: NewStoryProps) {
    return (
        <div className='max-h-full flex flex-col items-start'>
            <div className='flex flex-col h-full min-w-xl stretch text-justify overflow-scroll'>
                <>
                    <span className="mt-2 italic">Description:</span>
                    <div className='bg-secondary rounded-md shadow-lg my-3 p-2 grow-0'>
                        {form.description}
                    </div>
                </>
                {form.instruction &&
                    <>
                        <span className="mt-2 italic">Instruction: </span>
                        <p className='bg-secondary rounded-md shadow-lg my-3 p-2 grow-0'>
                            {form.instruction}
                        </p>
                    </>
                }
                <h1 className='text-2xl  my-5 font-semibold'>{newStory.title}</h1>
                {false &&
                    <>
                        <span>Tag: </span>
                        <p>{newStory.tag}</p>
                    </>
                }
                {newStory.introduction &&
                    <>
                        <span className="mt-2 italic">Introduction: </span>
                        <div className='bg-secondary rounded-md shadow-lg my-3 p-2 grow-0'>
                            {newStory.introduction}
                        </div>
                    </>
                }
                {newStory.choices &&
                    <>
                        <span className="mt-2 italic">Choices: </span>
                        {newStory.choices.map((choice, i) =>
                            <p key={i} className='bg-secondary rounded-md shadow-lg my-3 p-2 grow-0'>
                                {choice}
                            </p>
                        )}
                    </>
                }
            </div>
            <div className='flex flex-grow'>
                {(!newStory.choices || newStory.choices.filter(c => c != '').length != form.choices) ?
                    <Loading /> :
                    <div className='flex gap-5 my-5'>
                        <button onClick={() => playStory()}
                            className='mt-5 px-3 py-2 w-fit bg-secondary hover:bg-tertiary rounded-lg'>Play</button>
                        <button id="play" onClick={() => setStory({})}
                            className='mt-5 px-3 py-2 w-fit bg-red-500 hover:bg-red-700 rounded-lg'>Clear</button>
                    </div>
                }
            </div>
        </div>

    )
}
