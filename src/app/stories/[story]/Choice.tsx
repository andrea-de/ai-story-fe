interface ChoiceProps {
    choice: string,
    choiceKey: string,
    action: any,
    ready?: boolean,
    regenerate?: any,
    isLoading: boolean
}

export const Choice = ({ choice, choiceKey, action, ready, regenerate, isLoading }: ChoiceProps) => {
    return (
        <div className='flex min-h-[4rem]'>
            <div onClick={() => action(choiceKey)}
                className={`mt-5 p-2 w-full bg-tertiary hover:bg-secondary shadow-lg rounded-md relative 
                ${!ready ? 'border-2 border-white' : ''}`}>
                <button className="text-left flex justify-between mb-3">
                    {choice}
                </button>
                {!ready &&
                    <div className='absolute right-2 bottom-1 text-sm italic point cursor-pointer'>
                        generate{regenerate && !isLoading &&
                        <> / <span onClick={(event) => regenerate(choiceKey, event)} className='underline'>regenerate</span></>
                        }
                    </div>
                }
            </div>
        </div>
    )
}