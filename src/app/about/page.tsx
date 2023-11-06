import './about.css'

export default function AboutPage() {
    
    const name = 'ChoiceAI';

    return (
        <div className="max-h-full w-[80%] max-w-2xl text-justify flex flex-col">
            <h1 className="mb-5 text-3xl text-center">{name} Adventures</h1>
            <div className="grow overflow-scroll pr-2">
                <span>
                    {`Introducing "${name} Adventures", an innovative and immersive storytelling application that puts you at the heart of the narrative. With ${name}, you become the author of your own adventures. Craft a captivating story in the second person narrative, set the stage with your chosen settings, and then embark on a thrilling journey. As the protagonist, you'll face decisions at critical junctures, shaping the tale's outcome. Will you choose the path of a hero, a detective, or perhaps an explorer? ${name} offers endless possibilities.`}
                </span>
                <br />
                <br />
                <span>
                    {`Not only can you create and play your own tales, but you can also explore and review the imaginative narratives crafted by fellow users, making storytelling a collaborative and engaging experience like never before. Immerse yourself in the world of "${name}" and let your creativity flourish.`}
                </span>
            </div>
        </div>
    )
}