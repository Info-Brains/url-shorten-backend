import { NextFunction, Request, Response, Router } from "express";
import HealthCheck from "@business/middlewares/health.mw";
import ShortenUrl from "@business/middlewares/shorten.mw";
import BusinessLogicRoute from "@business/apis/_router";
import logger from "@utils/logger.util";

const router = Router();

router.get("/health", HealthCheck);
router.get("/shorten/:id", ShortenUrl);
router.use("/api", BusinessLogicRoute);

router.use((_req: Request, _res: Response, next: NextFunction) => {
    next({
        status: 404,
        message: "Not Found",
        error: {
            code: "NOT_FOUND",
            details: "API returned 404 error",
        },
    });
});

// Global error handler middleware
router.use((error: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`[${req.method}] ${req.originalUrl} - ${error.message}`);

    res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
        error: {
            code: error.error.code || "INTERNAL_SERVER_ERROR",
            details: error.error.details || "Internal Server Error",
        },
    });
    return;
});

export default router;
