import { setupSwagger } from "@config/swagger.config";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";

const App: Application = express();

App.use(express.urlencoded({ extended: true }));
App.use(express.static("public"));
App.use(express.json());
App.use(cors());
App.use(
    rateLimit({
        windowMs: 60 * 1000, // 1min
        limit: 100, // max 100 request
        standardHeaders: true,
        legacyHeaders: true,
    })
);

setupSwagger(App, "/api-docs");

export default App;
