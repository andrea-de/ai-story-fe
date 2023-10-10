import chalk from "chalk";
import logger from "@/app/helper/logger";

const API_URL = 'https://api.openai.com/v1/chat/completions';
// const API_URL = '';
const API_KEY = process.env.REACT_APP_OPENAI_KEY
const HEADERS = {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${API_KEY}`
}

class Chat {

    stack: { role: string, content: string }[] = [];
    tokens: number

    constructor() {
        this.tokens = 0
    }

    last = () => this.stack[this.stack.length - 1].content;

    async send(message: string, temperature: number = .9): Promise<string> {
        const newMessage = { "role": "user", "content": message };
        this.stack.push(newMessage);
        await this.fetch(this.stack, temperature)
        return this.last();
    }

    async fetch(messages: { role: string, content: string }[], temperature: number) {
        const response = await fetch(API_URL, {
            // cache: 'no-store',
            method: "POST",
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // price: .002 / 1K
                // model: "babbage-002", // price: .0004 / 1K
                messages: messages,
                temperature: temperature,
                max_tokens: 1000
            }),
            headers: HEADERS,
        }).then(res => res.json())
        if (response.error) {
            logger.error(`GPT_ERROR: ${response.error.type} - ${response.error.message} \n`);
            throw new Error('Model Request Error')
        }
        const newMessage = response.choices[0].message
        this.tokens += response.usage.total_tokens
        this.stack.push(newMessage)
    }

    logTokensUsed = (task?: string) => {
        const taskMessage = !task ? '' : ` (${task})`
        if (this.tokens <= 200) logger.debug(chalk.bold.greenBright('Tokens Used: ' + this.tokens) + taskMessage + '\n');
        else if (this.tokens <= 500) logger.debug(chalk.bold.redBright('Tokens Used: ' + this.tokens) + taskMessage + '\n');
        else logger.debug(chalk.bold.bgRedBright('Tokens Used: ' + this.tokens) + taskMessage + '\n');
    }

}

export class ChatGPTClient {

    static async generateDescription(): Promise<string> {
        try {
            const descriptionMessage = "Write a random very short description of a random story in 2nd person narrative. Two sentences maximum."
            const chat = new Chat()
            const segment = await chat.send(descriptionMessage, 1.1)

            chat.logTokensUsed('description')
            return segment
        } catch (error: any) {
            logger.error(error + '\n');
            throw error
        }
    }

    static async generateNewStory(description: string): Promise<[string, string, string]> {
        try {
            const titleMesage = "What would be a good title for a story that fits this description?: \n\n" + description + "\n\n Less than 5 words please."
            const tagMessage = "generate a tag for this story which contains 7 lowercase words with hyphens in between"
            const segmentMessage = "Write a beggining of a story in 2nd person narrative that eloborates on the following story: \n\n" + description + " \n\nThe output should be about 80 words long and the time frame of the story events should be immediate."

            const chat = new Chat()
            const title = await chat.send(titleMesage)
            const tag = await chat.send(tagMessage)
            const segment = await chat.send(segmentMessage)
            chat.logTokensUsed('title, tag, introduction')

            return [title.replaceAll('"', ''), tag, segment]
        } catch (error: any) {
            logger.error(error.stack + '\n');
            return error
        }
    }

    static async generateChoices(segments: string[], numChoices: number): Promise<string[]> {
        try {
            const story = segments.join('\n\n')
            const initialChoiceMessage = "In one brief sentence no more than 10 words, describe a simple action in 2nd person narrative that would continue the following story: \n" + story + "\n\n  The sentence should start with you"
            const additionalChoiceMessage = "In one brief sentence no more than 10 words, describe a completely different simple action in 2nd person narrative to continue the story. The sentence should start with you"

            const choices = []
            const chat = new Chat()
            choices.push(await chat.send(initialChoiceMessage))
            for (let i = 1; i < numChoices; i++) {
                choices.push(await chat.send(additionalChoiceMessage))
            }
            chat.logTokensUsed('choices')

            return choices
        } catch (error: any) {
            logger.error(error.stack + '\n');
            return error
        }
    }

    static async generateContinuation(segments: string[], choice: string, numChoices: number): Promise<[string, string[]]> {
        try {
            if (numChoices <= 0) {
                const ending: string = await this.generateEnding(segments, choice);
                return [ending, []]
            }

            const story = segments.join('\n\n')
            const nextSegmentMessage = story + "\n\n" + "Given the following action, please provide one paragraph of about 60 words which describes the next segment that continues this story:" + "\n\n" + choice

            const chat = new Chat()
            const nextSegment = await chat.send(nextSegmentMessage)
            chat.logTokensUsed('next segment')
            const nextChoices = await this.generateChoices([...segments, nextSegment], numChoices)

            return [nextSegment, nextChoices]
        } catch (error: any) {
            logger.error(error.stack + '\n');
            return error
        }
    }

    static async generateEnding(segments: string[], choice: string): Promise<string> {
        const story = segments.join('\n\n')
        const endingMessage = story + "\n\n" + "Given the following action, please provide one paragraph of about 60 words which describes an ending to this story:" + "\n\n" + choice

        const chat = new Chat()
        const ending = await chat.send(endingMessage)
        chat.logTokensUsed('ending')

        return ending
    }

    apiUrl: string = 'https://api.chatgpt.com';

    static nextSegment = (n: number): string => `Please provide the next segment to continue this story`
    static nextChoices = (n: number): string => `Please provide an ${n} more choices to continue this story`
    static ending = "Please provide an ending to this story"
    static new = "Please provide an introductory paragraph for a new story about the following"

    static async newStory(prompt: string, nextChoices: number): Promise<[string, string, string, string[]]> {
        const [title, tag, segment] = await this.generateNewStory(prompt)
        const choices = await this.generateChoices([segment], nextChoices)
        return [title, tag, segment, choices]
    }

    static async continue(storyAtPosition: string[], choice: string, nextChoices: number): Promise<[string, string[]]> {
        const [segment, choices] = await this.generateContinuation(storyAtPosition, choice, nextChoices)
        return [segment, choices]
    }

}
