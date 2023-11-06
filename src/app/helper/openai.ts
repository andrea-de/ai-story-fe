import chalk from "chalk";
import logger from "@/app/helper/logger";

// import { OpenAIStream,  } from 'ai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
export const runtime = 'edge';
import { useCompletion } from 'ai/react';

const API_KEY = process.env.REACT_APP_OPENAI_KEY

async function POST(messages: any, model: string) {
    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_KEY,
    });

    const response = await openai.chat.completions.create({
        model: model,
        stream: false,
        messages: messages
    });

    return response
}

const API_URL = 'https://api.openai.com/v1/chat/completions';

async function POST_FETCH(messages: any, model: string, temperature?: string) {
    return await fetch(API_URL, {
        cache: 'no-store',
        method: "POST",
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: 1000
        }),
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${API_KEY}`
        },
    }).then(res => res.json())

}

import { OpenAIStream, StreamingTextResponse,  } from 'ai';
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY || '',
});

// export async function STREAM(stack: { role: string, content: string }[]) {
export async function STREAM(stack: ChatCompletionMessageParam[]) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            // messages: [{ "role": "user", "content": "hi!!" }]
            messages: stack
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.log(error);
    }
}

class Chat {

    stack: { role: string, content: string }[] = [];
    tokens: number
    timer: Date
    model: string = "gpt-3.5-turbo" // price: .0004 / 1K
    // model: string = "gpt-3.5-turbo-0301"
    // model: string = "gpt-3.5-turbo-0613" // fastest

    constructor() {
        this.tokens = 0
        this.timer = new Date()
    }

    last = () => this.stack[this.stack.length - 1].content;

    async stream({ message, temperature = 0.9, task = null }: { message: string, temperature?: number, task?: string | null }): Promise<string> {
        const newMessage = { "role": "user", "content": message.concat() };
        this.stack.push(newMessage);
        await this.fetch(this.stack, temperature, task)
        return this.last();
    }
    
    async send({ message, temperature = 0.9, task = null }: { message: string, temperature?: number, task?: string | null }): Promise<string> {
        const newMessage = { "role": "user", "content": message.concat() };
        this.stack.push(newMessage);
        await this.fetch(this.stack, temperature, task)
        return this.last();
    }

    async fetch(messages: { role: string, content: string }[], temperature: number, task: string | null,) {
        // if (task != null) console.debug('OpenAI Fetch Started: ' + task.toString())
        // const response: any = await POST_FETCH(messages, this.model)
        const response: any = await POST(messages, this.model)
        // if (task != null) console.debug('OpenAI Fetch Finished: ' + task.toString())
        if (response.error) {
            console.error(`GPT_ERROR: ${response.error.type} - ${response.error.message} \n`);
            throw new Error('Model Request Error: ' + response.error.message)
        }
        else if (response.choices[0].finish_reason != 'stop') {
            console.error(`GPT_INCOMPLETE: ${response.choices[0].finish_reason} \n`);
            throw new Error('OpenAI Response Incomplete: ' + response.choices[0].finish_reason)
        }
        else {
            const newMessage = response.choices[0].message
            this.tokens += response.usage.total_tokens
            this.stack.push(newMessage)
        }
    }
    
    
    async fetchstream(messages: { role: string, content: string }[], temperature: number, task: string | null,) {
        // if (task != null) console.debug('OpenAI Fetch Started: ' + task.toString())
        // const response: any = await POST_FETCH(messages, this.model)
        const response: any = await STREAM(messages as ChatCompletionMessageParam[])
        // if (task != null) console.debug('OpenAI Fetch Finished: ' + task.toString())
        if (response.error) {
            console.error(`GPT_ERROR: ${response.error.type} - ${response.error.message} \n`);
            throw new Error('Model Request Error: ' + response.error.message)
        }
        else if (response.choices[0].finish_reason != 'stop') {
            console.error(`GPT_INCOMPLETE: ${response.choices[0].finish_reason} \n`);
            throw new Error('OpenAI Response Incomplete: ' + response.choices[0].finish_reason)
        }
        else {
            const newMessage = response.choices[0].message
            this.tokens += response.usage.total_tokens
            this.stack.push(newMessage)
        }
    }

    logAPIMetrics = (task?: string) => {
        const taskMessage = !task ? '' : ` (${task})`
        const timer = ` ${(((new Date()).getTime() - this.timer.getTime()) / 1000).toFixed(1)} seconds`
        if (this.tokens <= 200) console.info(chalk.bold.greenBright('Tokens Used: ' + this.tokens) + taskMessage + timer + ` (${this.model})`);
        else if (this.tokens <= 500) console.info(chalk.bold.redBright('Tokens Used: ' + this.tokens) + taskMessage + timer + ` (${this.model})`);
        else { console.info(chalk.bold.bgRedBright('Tokens Used: ' + this.tokens) + taskMessage + timer + ` (${this.model})`); }
    }

}

export class ChatGPTClient {

    static async generateDescription(): Promise<string> {
        const descriptionMessage = "Write a very random very short description about for a fictional story in 2nd person narrative. Any random theme and audience. Two sentences and 20 words maximum."
        const chat = new Chat()
        const segment = await chat.send({ message: descriptionMessage, temperature: 1.1 })
        chat.logAPIMetrics('description')

        return segment
    }

    private static async generateNewStory(description: string): Promise<[string, string]> {
        const titleMesage = "What would be a good title for a story that fits this description?: \n\n" + description + "\n\n Less than 5 words please."
        const tagMessage = "generate a tag for this story which contains 7 lowercase words with hyphens in between"

        const chat = new Chat()
        const title = await chat.send({ message: titleMesage })
        const tag = await chat.send({ message: tagMessage })
        chat.logAPIMetrics('title and tag')

        return [title.replaceAll('"', ''), tag]
    }

    private static async generateIntroduction(description: string): Promise<string> {
        const segmentMessage = "Write a beggining of a story in 2nd person narrative that eloborates on the following story: \n\n" + description + " \n\nThe output should be about 40 words long and the time frame of the story events should be immediate."

        const chat = new Chat()
        const segment = await chat.send({ message: segmentMessage })
        chat.logAPIMetrics('introduction')

        return segment
    }


    private static async generateChoices(segments: string[], numChoices: number): Promise<string[]> {
        const story = segments.join('\n\n')
        const initialChoiceMessage = "In one brief sentence no more than 6 words, describe a simple action in 2nd person narrative that would continue the following story: \n" + story + "\n\n  The sentence should start with you"
        const additionalChoiceMessage = "In one brief sentence no more than 6 words, describe a completely different simple action in 2nd person narrative to continue the story. The sentence should start with you"

        const choices = []
        const chat = new Chat()
        choices.push(await chat.send({ message: initialChoiceMessage, task: 'choice' }))
        for (let i = 1; i < numChoices; i++) {
            choices.push(await chat.send({ message: additionalChoiceMessage, task: 'next choice' }))
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
        const nextSegment = await chat.send({ message: nextSegmentMessage, task: 'segment' })
        chat.logAPIMetrics('segment')
        const nextChoices = await this.generateChoices([...segments, nextSegment], numChoices)

        return [nextSegment, nextChoices]
    }

    private static async generateEnding(segments: string[], choice: string): Promise<string> {
        const story = segments.join('\n\n')
        const endingMessage = story + "\n\n" + "Given the following action, please provide one paragraph of about 30 words which describes an ending to this story:" + "\n\n" + choice

        const chat = new Chat()
        const ending = await chat.send({ message: endingMessage, task: 'ending' })
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
