import UrlModel from '@business/models/url.model';
import {Request, Response} from 'express';
import logger from "@utils/logger.util";

const shorten = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const data = await UrlModel.transaction(async (t) => {
            const url = await t.url.findUnique({
                where: {id: id, isDeleted: false},
            });

            if (!url) throw new Error("NOT_FOUND");

            await t.url.update({
                where: {id: id},
                data: {clicks: url.clicks + 1}
            });

            return url;
        });

        res.status(301).redirect(data.originalUrl);
    } catch (error) {
        // @ts-ignore
        if (error.message === "NOT_FOUND") {
            res.status(404).send(`<h1>404 Not Found</h1>`);
            return;
        }

        logger.error(`Shorten check failed: ${error}`);
        res.status(500).send(`<h1>Internal Server Error</h1>`);
    }
};

export default shorten;
