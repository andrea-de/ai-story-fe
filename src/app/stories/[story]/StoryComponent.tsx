
import { Story } from "./Story"
import Loading from '../components/Loading';

interface StoryComponentProps {
    form: Form,
    newStory: Story,
    setStory: any,
    playStory: any
}

export default function StoryComponent({ form, newStory, setStory, playStory }: NewStoryProps) {
