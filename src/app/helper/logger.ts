import winston from "winston";

// Define your logger configuration
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        // Add more transports if needed, e.g., file transport
    ],
});

export default logger;