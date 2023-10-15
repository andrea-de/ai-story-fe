import { ChatGPTClient } from "@/app/helper/openai";
import { Story } from './connection';
import { calcEnding, checkTree } from './storyHelper'
import logger from "./logger";

export const getStories = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    // Pass one more than limit for next page indication
    const stories = await Story.find({}).skip(skip).limit((Number(limit) + 1));
    return stories
}

export const getStory = async (tag: string) => {
    const story = await Story.findOne({ tag })
    return story
}

export const getStoryAtPosition = async (tag: string, position: string) => {
    const story: any = await Story.findOne({ tag })
    if (!story) throw new Error('TagInvalid: ' + tag + ' not found');

    const positions = position.split('-').map(p => parseInt(p))
    const nextPositionExists = story.segments.hasOwnProperty(position)
    if (!nextPositionExists) throw new Error('PositionInvalid');

    const segments = await (story as any).getStoryAtPosition([...positions]);
    const choices = await (story as any).getChoices([...positions]);

    return {
        name: story.name,
        tag: story.tag,
        segments: segments,
        choices: choices
    }
}

export const randomStory = async (): Promise<string> => {
    const randomStoryTagObject: { tag: string }[] = await Story.aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 0, tag: 1 } }
    ]);
    return randomStoryTagObject[0].tag;
}


export const createStory = async (description: string, parts: number, numChoices: number) => {
    const [title, tag] = await ChatGPTClient.newStory(description);

    const existing = await Story.findOne({ tag });
    if (existing) throw new Error('Request Error: Story already exists with tag: ' + tag)

    newStory(tag, title, description, parts, numChoices) // async task

    return {
        tag: tag,
        title: title
    }

}

const newStory = async (tag: string, title: string, description: string, parts: number, numChoices: number) => {
    const [segment, choices] = await ChatGPTClient.startStory(description, numChoices);
    const blurb = description; // should be received from ai

    const segmentsDict = { "0": segment }
    const choicesDict: { [key: string]: string } = choices.reduce((obj, choice, index) => {
        obj[(index + 1).toString()] = choice;
        return obj;
    }, {} as { [key: string]: string });

    // Persist Story
    const story = new Story({
        name: title,
        description: description,
        tag: tag,
        blurb: blurb,
        storyLengthMin: parts - 1,
        storyLengthMax: parts + 1,
        choicesLength: numChoices,
        choices: choicesDict,
        segments: segmentsDict
    });
    try {
        await story.save();
        logger.info('New Story Saved: ' + tag)       
    } catch (error) {
        logger.error('Error Saving New Story: ' + tag, error)       
    }
}

export const postStoryAction = async (tag: string, actionString: string, write = false, overwrite = false) => {
    const actions: number[] = actionString.split('-').map(p => parseInt(p)) // [1,2,1]
    const position: number[] = actions.length > 1 ? actions.slice(0, -1) : [0] // [1,2]
    const action: number = actions.length > 1 ? actions.slice(-1)[0] : actions[0] // 1

    // Validate Story
    const story = await Story.findOne({ tag: tag })
    if (!story) throw new Error('InvalidStoryError')

    // Validate Action
    if (action > story.choicesLength) throw new Error('InvalidActionIndexError')
    if (actions.length > story.storyLengthMax) throw new Error('InvalidActionPositionError')

    // Validate Previous Position
    // const currentPositionExists = await (story as any).checkTree(position)
    const currentPositionExists = checkTree(story, position)
    if (!currentPositionExists) throw new Error('InvalidPositionError')

    // Check next position exists
    const nextPositionExists = await (story as any).checkTree(actions)

    if (nextPositionExists && !overwrite) { // No existing continuation and not overriding
        const nextSegment = await (story as any).getSegment(actions)
        const nextChoices = await (story as any).getChoices(actions)
        let result = {
            segments: nextSegment,
            choices: nextChoices,
            generated: false
        }
        return result
    } else if (!write) { // Readonly
        throw new Error('ReadonlyError')
    }

    /* MUTATES STORY */ // Needs to confirm authorization for story writing/overwriting
    const storyAtPositionDict = await (story as any).getStoryAtPosition(actions)
    const storyAtPosition: string[] = Object.values(storyAtPositionDict)

    const choice = await (story as any).getChoice(actions)
    const isEnding = calcEnding(actions.length, story.storyLengthMin, story.storyLengthMax)
    const [newSegment, newChoices] = await ChatGPTClient.continue(storyAtPosition, choice, isEnding ? 0 : story.choicesLength);

    // Persist
    const newSegmentDict = await (story as any).updateSegment(actions, newSegment) // Insert Segment
    const newChoicesDict = (newChoices) ?
        await (story as any).updateChoices(actions, newChoices) : // Insert Choices
        await (story as any).updateChoices(actions, Array.from({ length: story.choicesLength }).fill(null)) // Insert null choices indicating ending

    // story.markModified('segments'); SAFER
    await Story.updateOne({ _id: story.id }, { $set: story.toJSON() });

    // Response
    let result = {
        segments: { ...newSegmentDict },
        choices: newChoicesDict,
        generated: true
    }
    return result
}
