import logger from '@utils/logger.util';
import ENV from '@config/env.config'

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
        logger.info(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });
} else {
    App.use("/", Router);

    App.listen(ENV.PORT, () => {
        logger.info(`Server is running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    });

    App.on("SIGINT", () => {
        logger.error(`Server off, SIGINT`);
        process.exit();
    });
}
