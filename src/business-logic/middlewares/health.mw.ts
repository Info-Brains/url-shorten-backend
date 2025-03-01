import { Request, Response } from "express";
import logger from "@utils/logger.util";

const healthCheck = (_req: Request, res: Response) => {
    try {
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        logger.error(`Health check failed: ${error}`);
    }
};

export default healthCheck;
