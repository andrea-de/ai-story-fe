// import { ChatGPTClient } from "@/app/helper/openai";
export const descriptionMessage = "Write a very random very short description about for a fictional story in 2nd person narrative. Any random theme and audience. Two sentences and 20 words maximum."

export const titleMessage = (description: string) =>
    "What would be a good title for a story that fits this description?: \n\n" + description + "\n\n Less than 5 words please."

export const tagMessage = (description: string) =>
    "generate a tag for the following story which contains 7 lowercase words with hyphens in between: \n" + description

export const introductionMessage = (description: string) =>
    "Write a beggining of a story in 2nd person narrative that eloborates on the following story: \n\n" + description + " \n\nThe output should be about 40 words long and the time frame of the story events should be immediate."


export const segmentPromptMessages = (segments: string[], choice: string): any[] => {
    const prompt = nextSegmentMessage(segments, choice).concat()
    const messages = [{ "role": "user", "content": prompt }]

    return messages
}

export const choicePromptMessages = (segments: string[], otherChoices: string[]): any[] => {
    const prompt = initialChoiceMessage(segments)
    const messages = [{ "role": "user", "content": prompt }]

    otherChoices.forEach((choice) => {
        messages.push({ "role": "assistant", "content": choice })
        messages.push({ "role": "user", "content": additionalChoiceMessage() })
    })

    return messages
}

export const endingPromptMessages = (segments: string[], choice: string): any[] => {
    const prompt = endingMessage(segments, choice).concat()
    const messages = [{ "role": "user", "content": prompt }]

    return messages
}

const nextSegmentMessage = (segments: string[], choice: string) =>
    segments.join('\n\n') + "\n\n" + "Given the following action, please provide one paragraph of about 30 words which describes the next segment that continues this story:" + "\n\n" + choice

const initialChoiceMessage = (segments: string[]) =>
    "In one brief sentence no more than 6 words, describe a simple action in 2nd person narrative that would continue the following story: \n" + segments.join('\n\n') + "\nThe sentence should start with you"

const additionalChoiceMessage = () =>
    "In one brief sentence no more than 6 words, describe a completely different simple action in 2nd person narrative to continue the story. The sentence should start with you"

const endingMessage = (segments: string[], choice: string) => segments.join('\n\n') + "\n" + "Given the following action, please provide one paragraph of about 30 words which describes an ending to this story:" + "\n\n" + choice
