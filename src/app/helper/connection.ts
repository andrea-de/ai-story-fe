import mongoose from "mongoose";
import { storySchema } from "./Story";
import logger from "./logger";

let connection: mongoose.Connection;

export const getConnection = (): mongoose.Connection => {
    if (connection) {
        return connection;
    }

    // Create new connection
    const uri: string = (process.env.REACT_APP_DB_URI ||
        "mongodb+srv://" +
        process.env.REACT_APP_ATLAS_USERNAME +
        ":" + process.env.REACT_APP_ATLAS_PASSWORD +
        "@" + process.env.REACT_APP_ATLAS_URI) +
        '/llm-story';

    connection = mongoose.createConnection(uri);

    connection
        .on('open', () => logger.info('Connected to Mongo'))
        .on('error', (err) => logger.error(err));

    return connection;
};

export type Story = mongoose.InferSchemaType<typeof storySchema>;
export const Story = getConnection().models.Story || getConnection().model<Story>('Story', storySchema);
// export const Story = mongoose.models.Story || mongoose.model<Story>('Story', storySchema);