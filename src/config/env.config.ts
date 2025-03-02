import dotenv from "dotenv";
import Joi from "joi";

(
    () => {
        if (process.env.NODE_ENV === "test") {
            dotenv.config({path: ".env.test"});
        } else {
            dotenv.config({path: ".env"});
        }
    }
)()

const envSchemaObject = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
    DATABASE_URL: Joi.string().required().not().uri().default("file:./dev.db"),
    JWT_SECRET: Joi.string().required(),
    BASE_URL: Joi.string().uri().default("http://localhost:3000"),
}).unknown(true);

const {error, value} = envSchemaObject.validate(process.env, {
    abortEarly: false,
});

if (error) {
    console.error("Error in the ENV validation");
    (error.details as { message: string }[]).forEach((detail: { message: string }) => {
        console.error(`  - ${detail.message}`);
    });
    process.exit(1);
}

const ENV = {
    PORT: value.PORT,
    NODE_ENV: value.NODE_ENV,
    DATABASE_URL: value.DATABASE_URL,
    JWT_SECRET: value.JWT_SECRET,
    BASE_URL: value.BASE_URL,
}

export default ENV;
