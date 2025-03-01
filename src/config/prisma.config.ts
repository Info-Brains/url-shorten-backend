import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
    private static instance: PrismaSingleton;
    private readonly _client: PrismaClient;

    private constructor() {
        try {
            this._client = new PrismaClient();
        } catch (error) {
            console.error("Failed to create PrismaClient instance:", error);
            throw error;
        }
    }

    public static getInstance(): PrismaSingleton {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new PrismaSingleton();
        }
        return PrismaSingleton.instance;
    }

    public get client(): PrismaClient {
        return this._client;
    }
}

// Export a single instance
const prisma = PrismaSingleton.getInstance().client;
export default prisma;
