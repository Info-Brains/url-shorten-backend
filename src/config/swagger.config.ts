import swaggerUi from "swagger-ui-express";
import { resolve, join } from "node:path";
import { readdirSync } from "node:fs";
import { Application } from "express";
import merge from "lodash.merge";
import YAML from "yamljs";

const loadAndMergeSpecs = (): any => {
    try {
        const apiDocsDir = resolve(__dirname, "../../api-docs");
        const yamlFiles = readdirSync(apiDocsDir)
            .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
            .map((file) => join(apiDocsDir, file));

        return yamlFiles
            .map((filePath) => YAML.load(filePath))
            .reduce((mergedSpec, currentSpec) => merge(mergedSpec, currentSpec), {});
    } catch (error) {
        console.error("Error loading Swagger specs:", error);
        throw error;
    }
};

export const setupSwagger = (app: Application, path: string): void => {
    const swaggerSpec = loadAndMergeSpecs();

    // Custom Swagger UI options
    const options = {
        customSiteTitle: "API Documentation",
        customCss: ".swagger-ui .topbar { display: none }",
    };

    app.use(path, swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
};
