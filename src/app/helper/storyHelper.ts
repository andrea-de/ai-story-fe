export function calcEnding(depth: number, min: number, max: number) {
    // eg (5 - 2) / (6 - 2) = 3/4 = .75 
    const ending = (depth == max) ? 1 :
        (depth < min) ? 0 :
            (depth - min) / (max - min);

    // eg (random < .75) is likely to end
    const isEnding: boolean = Math.random() < ending;
    if (isEnding) return true;
    return false;
    // ['Continue Story', 'More choices']
}

export function checkTree(story: any, position: number[]) {
    const segmentKeys: string[] = getSegmentKeysFromPosition([...position]); // [1,2] should search for "0", "1", "1-2"
    const segments = objectWithValueInArray(story.segments, segmentKeys)

    const choiceKeys: string[] = getChoiceKeysFromPosition([...position], story.choicesLength); // [1,2] should search for "1-2-1" ... "1-2-(n)" n=choicesLength
    const choices = objectWithValueInArray(story.choices, choiceKeys)

    const exists: boolean = (
        Object.keys(segments).length == segmentKeys.length
        &&
        Object.keys(choices).length == choiceKeys.length
    )
    return exists
}

function getSegmentKeysFromPosition(position: number[]): string[] {
    let positionFiltered = position.filter(p => p != 0)
    let segments = [];
    for (let i = 0; i < positionFiltered.length; i++) {
        let segment = position.slice(0, i + 1).join('-');
        segments.push(segment);
    }
    if (segments[0] != '0') segments.unshift('0');
    return segments
}

function getChoiceKeysFromPosition(position: number[], choicesLength: number): string[] {
    if (position.length > 1) position = position.filter(p => p != 0)
    const startPosition = position[0] != 0 ? position.join('-') + '-' : '';
    const choiceKeys: string[] = Array.from({ length: choicesLength }, (_, index) => startPosition + (index + 1));
    return choiceKeys
}

function objectWithValueInArray(obj: { [key: string]: any }, arr: string[]) {
    return arr.reduce((result, key) => (obj.hasOwnProperty(key) ? { ...result, [key]: obj[key] } : result), {})
}
