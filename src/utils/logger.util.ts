import ENV from "@config/env.config";
import winston from "winston";

const logLevels = {
    error: 0,
    warning: 1,
    info: 2,
    http: 3,
    debug: 4,
};

winston.configure({
    levels: logLevels,
    silent: ENV.NODE_ENV === "test",
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({
            format: "hh:mm:ss A",
        }),
        winston.format.printf(({ timestamp, level, message, logMetadata, stack }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${logMetadata || ""} ${message} ${stack || ""}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "./logs/transport.log" }),
    ],
});

export default winston;
