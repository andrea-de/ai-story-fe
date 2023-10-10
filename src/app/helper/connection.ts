import mongoose from "mongoose";
import { storySchema } from "./Story";
import logger from "./logger";

const uri: string = (process.env.REACT_APP_DB_URI ||
    "mongodb+srv://" +
    process.env.REACT_APP_ATLAS_USERNAME +
    ":" + process.env.REACT_APP_ATLAS_PASSWORD +
    "@" + process.env.REACT_APP_ATLAS_URI) +
    '/llm-story'; // /test?retryWrites=true&w=majority";

mongoose.connect(uri)

mongoose.connection
.on('open', () => logger.info('Connected to Mongo'))
.on('error', (err) => logger.error(err))

export const connection = mongoose

export const Story = mongoose.models.Story || mongoose.model<Story>('Story', storySchema);
export type Story = mongoose.InferSchemaType<typeof storySchema>;