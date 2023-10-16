import chalk from "chalk";
import logger from "@/app/helper/logger";

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_KEY
const HEADERS = {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${API_KEY}`
}

class Chat {

    stack: { role: string, content: string }[] = [];
    tokens: number
    timer: Date

    constructor() {
        this.tokens = 0
        this.timer = new Date()
    }

    last = () => this.stack[this.stack.length - 1].content;

    async send(message: string, temperature: number = .9): Promise<string> {
        const newMessage = { "role": "user", "content": message.concat() };
        this.stack.push(newMessage);
        await this.fetch(this.stack, temperature)
        return this.last();
    }

    async fetch(messages: { role: string, content: string }[], temperature: number) {
        logger.debug('Fetch to OpenAI')
        const response = await fetch(API_URL, {
            cache: 'no-store',
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
            throw new Error('Model Request Error: ' + response.error.message)
        }
        const newMessage = response.choices[0].message
        this.tokens += response.usage.total_tokens
        this.stack.push(newMessage)
    }

    logAPIMetrics = (task?: string) => {
        const taskMessage = !task ? '' : ` (${task})`
        const timer = ` ${(((new Date()).getTime() - this.timer.getTime()) / 1000).toFixed(1)} seconds`
        if (this.tokens <= 200) logger.debug(chalk.bold.greenBright('Tokens Used: ' + this.tokens) + taskMessage + timer + '\n');
        else if (this.tokens <= 500) logger.debug(chalk.bold.redBright('Tokens Used: ' + this.tokens) + taskMessage + timer + '\n');
        else { logger.debug(chalk.bold.bgRedBright('Tokens Used: ' + this.tokens) + taskMessage + timer + '\n'); }
    }

}

export class ChatGPTClient {

    static async generateDescription(): Promise<string> {
        const descriptionMessage = "Write a very random very short description about for a fictional story in 2nd person narrative. Any random theme and audience. Two sentences and 20 words maximum."
        const chat = new Chat()
        const segment = await chat.send(descriptionMessage, 1.1)
        chat.logAPIMetrics('description')

        return segment
    }

    private static async generateNewStory(description: string): Promise<[string, string]> {
        const titleMesage = "What would be a good title for a story that fits this description?: \n\n" + description + "\n\n Less than 5 words please."
        const tagMessage = "generate a tag for this story which contains 7 lowercase words with hyphens in between"

        const chat = new Chat()
        const title = await chat.send(titleMesage)
        const tag = await chat.send(tagMessage)
        chat.logAPIMetrics('title and tag')

        return [title.replaceAll('"', ''), tag]
    }

    private static async generateIntroduction(description: string): Promise<string> {
        const segmentMessage = "Write a beggining of a story in 2nd person narrative that eloborates on the following story: \n\n" + description + " \n\nThe output should be about 40 words long and the time frame of the story events should be immediate."

        const chat = new Chat()
        const segment = await chat.send(segmentMessage)
        chat.logAPIMetrics('introduction')

        return segment
    }


    private static async generateChoices(segments: string[], numChoices: number): Promise<string[]> {
        const story = segments.join('\n\n')
        const initialChoiceMessage = "In one brief sentence no more than 6 words, describe a simple action in 2nd person narrative that would continue the following story: \n" + story + "\n\n  The sentence should start with you"
        const additionalChoiceMessage = "In one brief sentence no more than 6 words, describe a completely different simple action in 2nd person narrative to continue the story. The sentence should start with you"

        const choices = []
        const chat = new Chat()
        choices.push(await chat.send(initialChoiceMessage))
        for (let i = 1; i < numChoices; i++) {
            choices.push(await chat.send(additionalChoiceMessage))
        }
        chat.logAPIMetrics('choices')

        return choices
    }

    private static async generateContinuation(segments: string[], choice: string, numChoices: number): Promise<[string, string[]]> {
        if (numChoices <= 0) {
            const ending: string = await this.generateEnding(segments, choice);
            return [ending, []]
        }

        const story = segments.join('\n\n')
        const nextSegmentMessage = story + "\n\n" + "Given the following action, please provide one paragraph of about 30 words which describes the next segment that continues this story:" + "\n\n" + choice

        const chat = new Chat()
        const nextSegment = await chat.send(nextSegmentMessage)
        chat.logAPIMetrics('segment')
        const nextChoices = await this.generateChoices([...segments, nextSegment], numChoices)

        return [nextSegment, nextChoices]
    }

    private static async generateEnding(segments: string[], choice: string): Promise<string> {
        const story = segments.join('\n\n')
        const endingMessage = story + "\n\n" + "Given the following action, please provide one paragraph of about 30 words which describes an ending to this story:" + "\n\n" + choice

        const chat = new Chat()
        const ending = await chat.send(endingMessage)
        chat.logAPIMetrics('ending')

        return ending
    }

    // private static nextSegment = (n: number): string => `Please provide the next segment to continue this story`
    // private static nextChoices = (n: number): string => `Please provide an ${n} more choices to continue this story`
    // private static ending = "Please provide an ending to this story"
    // private static new = "Please provide an introductory paragraph for a new story about the following"

    static async newStory(prompt: string): Promise<[string, string]> {
        // const [title, tag, segment] = await this.generateNewStory(prompt)
        const [title, tag] = await this.generateNewStory(prompt)

        return [title, tag]
    }
    
    static async startStory(prompt: string, nextChoices: number): Promise<[string, string[]]> {
        const segment = await this.generateIntroduction(prompt)
        const choices = await this.generateChoices([segment], nextChoices)
        
        return [segment, choices]
    }
        
    static async continue(storyAtPosition: string[], choice: string, nextChoices: number): Promise<[string, string[]]> {
        const [segment, choices] = await this.generateContinuation(storyAtPosition, choice, nextChoices)
        return [segment, choices]
    }

}
