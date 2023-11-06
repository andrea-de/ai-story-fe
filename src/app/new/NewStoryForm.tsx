import { ImHourGlass } from '@react-icons/all-files/im/ImHourGlass';
import { Form } from "./Form"

interface FormProps {
    form: Form,
    handleFormChange: any,
    generateEnabled: boolean,
    handleGenerate: any,
    handleSubmit: any,
    submitEnabled: boolean,
    handleClear: any
}

export default function NewStoryForm({ form, handleFormChange, handleGenerate, generateEnabled, handleSubmit, submitEnabled, handleClear }: FormProps) {
    return (
        <form className="" onSubmit={handleSubmit} >
            <h1 className='text-3xl'>New Story</h1>
            <label className='block my-5 font-semibold'>Description</label>
            <textarea name="description" value={form.description} onChange={handleFormChange} maxLength={500}
                className="block w-11/12 h-28 max-h-52 p-2 ml-1 resize-y shadow-lg rounded-md bg-secondary">
            </textarea>

            <button onClick={handleGenerate} disabled={!generateEnabled}
                className='text-sm py-2 px-5 my-2 ml-1 rounded-md shadow-lg border-2 focus:outline-none bg-secondary hover:bg-tertiary border-white disabled:bg-gray-300 dsabled:border-0'>
                Generate
            </button>

            <label className='block my-3 font-semibold'>Instruction</label>
            <input name="instruction" value={form.instruction} onChange={handleFormChange} maxLength={500}
                className="w-11/12 p-2 ml-1 shadow-lg rounded-md bg-secondary">
            </input>

            <div className='flex flex-wrap my-5 gap-3'>
                <div className='flex'>
                    <label className='font-semibold'>Parts</label>
                    <input type="range" id="parts" name="parts" value={form.parts} onChange={handleFormChange} min="4" max="7"
                        className="ml-5 accent-secondary" />
                    <span className='pl-5 pr-10 font-bold italic'>{form.parts}</span>
                </div>

                <div className='flex'>
                    <label className='font-semibold'>Choices</label>
                    <input type="range" id="choices" name="choices" value={form.choices} onChange={handleFormChange} min="2" max="4"
                        className="ml-5 accent-secondary" />
                    <span className='pl-5 font-bold italic'>{form.choices}</span>
                </div>
            </div>

            <div className="flex flex-row items-center w-full mt-5">
                <span className='font-semibold text-xs mr-5'>Story Length:</span>
                <div className='inline-flex gap-2'>
                    {['short', 'medium', 'long'].map((e, i) =>
                    (
                        <div className="hour" key={i}>
                            <input type="radio" id={e} name="length" checked={form.length === e} onChange={handleFormChange} value={e} hidden />
                            <label htmlFor={e} className={`text-white w-10 h-10 bg-secondary hover:bg-white hover:text-secondary rounded-lg text-center flex justify-center items-center ${form.length === e ? 'bg-white' : ''}`}>
                                <ImHourGlass className={form.length === e ? 'text-secondary' : ''} size={20 + 5 * i} />
                            </label>
                        </div>
                    ))}
                </div>
                <span className='ml-5 font-semibold italic'>
                        {`${form.length.charAt(0).toUpperCase()}${form.length.slice(1)}`}
                    </span>

            </div>
            <div className='flex gap-5 mt-8 text-lg'>
                <input type="submit" value="Submit" disabled={!submitEnabled}
                    className='block p-2 rounded-md shadow-lg bg-secondary hover:bg-tertiary cursor-pointer 
                    disabled:bg-gray-300 disabled:pointer-events-none'/>
                <button onClick={handleClear} className='px-3 w-fit bg-red-500 hover:bg-red-700 rounded-lg'>Clear</button>
            </div>
        </form>
    )
}