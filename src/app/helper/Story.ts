import mongoose, { Schema } from 'mongoose';

export const storySchema = new Schema(
    {
        description: { type: String, required: true }, // provided by user
        name: { type: String, required: true }, // provided by user or generated
        instruction: { type: String, required: false }, // provided by user
        blurb: { type: String, required: false }, // generated
        tag: { type: String, required: false, unique: true }, // generated

        choices: { type: Schema.Types.Mixed, default: {} }, // Makes up story
        segments: { type: Schema.Types.Mixed, default: {} }, // Makes up story

        storyLengthMin: { type: Number, default: 6 }, // Minimum number of stories before the story is finished
        storyLengthMax: { type: Number, default: 6 }, // Maximim number of stories before the story is finished
        choicesLength: { type: Number, default: 2 }, // How many choices per node

        storyWords: { type: Number, default: 50 }, // How many words should be told at the point in the story
        choicesWords: { type: Number, default: 10 }, // How many words should be in a choice
        
        // generating: { type: Boolean, required: false }, // generating currently
        completed: { type: Number, default: 0 }, // From 0 to 100
        finished: { type: Boolean, default: false }, // are there any unwritten sections
        latest: { type: Boolean, default: false }, // is this unfinished and not the latest of all the stories of the root 

        root: { type: String }, // Root Story
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner of story
        following: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' }, // people who saved story
    },
    {
        methods: {
            async getSegment(position: number[]): Promise<object> { // [1,2] -> Returns segment 1-2
                let segmentKey = position.join('-');
                segmentKey = segmentKey.replace('0-', '')
                return { [segmentKey]: this.segments[segmentKey] }
            },
            async getStoryAtPosition(position: number[]): Promise<object> { // [1,2] -> Returns sements 0, 1, and 1-2
                const segmentKeys = getSegmentKeysFromPosition(position);
                return segmentKeys.reduce((obj, key) => (this.segments.hasOwnProperty(key) ? { ...obj, [key]: this.segments[key] } : obj), {})
            },

            async getChoice(position: number[]): Promise<string> { // [1,2,1] -> Returns choice 1-2-1
                let choiceKey = position.join('-')
                choiceKey = choiceKey.replace('0-', '')
                return this.choices[choiceKey]
            },
            async getChoices(position: number[]): Promise<object> { // [1,2] -> Returns choices 1-2-1, 1-2-2 ... n of choicesLength
                const choiceKeys: string[] = getChoiceKeysFromPosition(position, this.choicesLength); // [1,2] should search for "1" and "1-(n)" n=choicesLength
                return choiceKeys.reduce((obj, key) => (this.choices.hasOwnProperty(key) ? { ...obj, [key]: this.choices[key] } : obj), {})
            },
            async getReadyChoices(position: number[]): Promise<string[]> {
                const choiceKeys: string[] = getChoiceKeysFromPosition(position, this.choicesLength); // [1,2] should search for "1" and "1-(n)" n=choicesLength
                return choiceKeys.reduce((array: string[], key) => (this.segments.hasOwnProperty(key) ? [...array, key] : array), [])
            },
            async updateSegment(position: number[], segment: string[]): Promise<object> {
                if (position.length > 1) position = position.filter(p => p != 0)
                const segmentKey = position.join('-');
                this.segments[segmentKey] = segment;
                let segmentDict: { [key: string]: string[] } = { [segmentKey]: segment }
                return segmentDict
            },
            async updateChoices(position: number[], choices: string[]): Promise<object> {
                let choicesDict: { [key: string]: string } = {}
                position = position.filter(p => p != 0)
                for (let i = 0; i < choices.length; i++) {
                    const choiceKey = position.join('-') + '-' + (i + 1);
                    this.choices[choiceKey] = choices[i];
                    choicesDict[choiceKey] = choices[i];
                }
                return choicesDict
            },
            async checkTree(position: number[]): Promise<boolean> {
                const segmentKeys: string[] = getSegmentKeysFromPosition([...position]); // [1,2] should search for "0", "1", "1-2"
                const segments = objectWithValueInArray(this.segments, segmentKeys)

                const choiceKeys: string[] = getChoiceKeysFromPosition([...position], this.choicesLength); // [1,2] should search for "1-2-1" ... "1-2-(n)" n=choicesLength
                const choices = objectWithValueInArray(this.choices, choiceKeys)

                const exists: boolean = (
                    Object.keys(segments).length == segmentKeys.length
                    &&
                    Object.keys(choices).length == choiceKeys.length
                )
                return exists
            },
        },
    }
);

export function getSegmentKeysFromPosition(position: number[]): string[] {
    let positionFiltered = position.filter(p => p != 0)
    let segments = [];
    for (let i = 0; i < positionFiltered.length; i++) {
        let segment = position.slice(0, i + 1).join('-');
        segments.push(segment);
    }
    if (segments[0] != '0') segments.unshift('0');
    return segments
}

export function getChoiceKeysFromPosition(position: number[], choicesLength: number): string[] {
    if (position.length > 1) position = position.filter(p => p != 0)
    const startPosition = position[0] != 0 ? position.join('-') + '-' : '';
    const choiceKeys: string[] = Array.from({ length: choicesLength }, (_, index) => startPosition + (index + 1));
    return choiceKeys
}

export function objectWithValueInArray(obj: { [key: string]: any }, arr: string[]) {
    return arr.reduce((result, key) => (obj.hasOwnProperty(key) ? { ...result, [key]: obj[key] } : result), {})
}