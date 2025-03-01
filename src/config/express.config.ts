import { setupSwagger } from "@config/swagger.config";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import ENV from "@config/env.config";
import morgan from "morgan";
import cors from "cors";

const App: Application = express();

App.use(morgan(ENV.NODE_ENV === "production" ? "combined" : "dev"));
App.use(express.urlencoded({ extended: true }));
App.use(express.static("public"));
App.use(express.json());
App.use(cors());
App.use(
    rateLimit({
        windowMs: 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: true,
    })
);

setupSwagger(App, "/api-docs");

export default App;
