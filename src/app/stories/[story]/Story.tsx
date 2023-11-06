export type Story = {
    tag: string
    name: string
    segments: { [s: string]: string }
    choices: { [s: string]: string }
    ready: [string] // Choices have already been generated
    regenerate?: boolean // Regeneration allowed only after initial generation
};