import ENV from "@config/env.config";
import logger from "@utils/logger.util";

import App from "@config/express.config";
import Router from "./router";

// Define a route
App.use("/", Router);

// Start the server
if (ENV.NODE_ENV !== "test") {
    App.listen(ENV.PORT, () => {
        logger.info(`Server is running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    });
}

App.on("SIGINT", () => {
    logger.error(`Server off, SIGINT`);
    process.exit();
});

export default App;
