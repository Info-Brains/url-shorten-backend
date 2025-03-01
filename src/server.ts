import logger from "@utils/logger.util";
import ENV from "@config/env.config";

import App from "./config/express.config";
import cluster from "node:cluster";
import Router from "./router";
import os from "node:os";

const MAX_INSTANCES: number = 16;

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    const numInstances: number = Math.min(numCPUs, MAX_INSTANCES);
    logger.info(`Master process is running. Forking for ${numInstances} instances...`);

    // Fork workers
    for (let i = 0; i < numInstances; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        logger.warn(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });
} else {
    const workerId = cluster.worker?.id || "unknown";
    const processId = process.pid;

    // Prefix logs with the worker ID
    const logWithWorker = (message: string) =>
        logger.info(`[Worker ${workerId} | PID ${processId}] -- ${message}`);

    App.use("/", Router);

    App.listen(ENV.PORT, () => {
        logWithWorker(`Server is running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    });

    process.on("SIGINT", () => {
        logWithWorker("Received SIGINT. Shutting down...");
        process.exit();
    });
}
