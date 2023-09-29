import Link from "next/link";
import Api from "../helper/api";

const api = new Api();

async function getStories() {
    return api.getStories();
    // return staticStories;
}

export default async function Page() {
    const stories: Array<any> = await getStories();
    // console.log(stories);

    return (
        <div>
            <h1>Stories</h1>
            <div className="mb-10 min-w-[80%] max-h-[70%] overflow-y-scroll">
                {stories.map((story => (
                    StoryCard(story)
                )))}
            </div>
        </div>
    )
}

const StoryCard = (story: any) => (
    // <Link href={'stories/' + story._id} key={story._id}>
    <Link href={'stories/' + story._id}>
        <div className="storycard">
            <h3>{story.name}</h3>
            <p>{story.prompt}</p>
            <div className="storycard-details">
                <span>Complete: {story.complete}%</span>
                <span>Lore Score: {story.following}</span>
            </div>
        </div>
    </Link>

);

const staticStories = [
    {
        "name": "Commodo id",
        "prompt": "Commodo id id qui labore voluptate ipsum ipsum enim commodo ullamco officia.",
        "complete": 10,
        "following": 9
    },
    {
        "name": "Sint amet",
        "prompt": "Sint amet enim dolore officia id proident.",
        "complete": 2,
        "following": 2
    },
    {
        "name": "Cillum veniam nisi",
        "prompt": "Cillum veniam nisi cupidatat amet excepteur cupidatat aute nostrud voluptate sunt cillum irure excepteur.",
        "complete": 24,
        "following": 21
    },
    {
        "name": "Commodo id",
        "prompt": "Commodo id id qui labore voluptate ipsum ipsum enim commodo ullamco officia.",
        "complete": 10,
        "following": 9
    },
    {
        "name": "Sint amet",
        "prompt": "Sint amet enim dolore officia id proident.",
        "complete": 2,
        "following": 2
    },
    {
        "name": "Cillum veniam nisi",
        "prompt": "Cillum veniam nisi cupidatat amet excepteur cupidatat aute nostrud voluptate sunt cillum irure excepteur.",
        "complete": 24,
        "following": 21
    },
    {
        "name": "Commodo id",
        "prompt": "Commodo id id qui labore voluptate ipsum ipsum enim commodo ullamco officia.",
        "complete": 10,
        "following": 9
    },
    {
        "name": "Sint amet",
        "prompt": "Sint amet enim dolore officia id proident.",
        "complete": 2,
        "following": 2
    },
    {
        "name": "Cillum veniam nisi",
        "prompt": "Cillum veniam nisi cupidatat amet excepteur cupidatat aute nostrud voluptate sunt cillum irure excepteur.",
        "complete": 24,
        "following": 21
    },
]