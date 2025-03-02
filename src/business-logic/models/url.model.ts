import prisma from "@config/prisma.config";
import {Prisma} from "@prisma/client";

export default class Url {
    private static modelName: string = "Url";

    public static async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return prisma.$transaction(callback);
    }

    public static async findMany({where, select, page = 1, limit = 10}: {
        where?: Prisma.UrlWhereInput;
        select?: Prisma.UrlSelect;
        page?: number;
        limit?: number;
    }) {
        const [urls, urlsTotal] = await (prisma as any).$transaction([
            (prisma as any)[this.modelName].findMany({
                where,
                select,
                skip: (page - 1) * limit,
                take: limit
            }),
            (prisma as any)[this.modelName].count({where})
        ]);

        return {urls, urlsTotal};
    }

    public static findOne({where, select}: {
        where: Prisma.UrlWhereUniqueInput;
        select?: Prisma.UrlSelect;
    }) {
        return (prisma as any)[this.modelName].findUnique({where, select});
    }

    public static create({data, select}: {
        data: Prisma.UrlCreateInput;
        select?: Prisma.UrlSelect;
    }) {
        return (prisma as any)[this.modelName].create({data, select});
    }

    public static update({where, data, select}: {
        where: Prisma.UrlWhereUniqueInput;
        data: Prisma.UrlUpdateInput;
        select?: Prisma.UrlSelect;
    }) {
        return (prisma as any)[this.modelName].update({where, data, select});
    }

    public static softDelete({where, select}: {
        where: Prisma.UrlWhereUniqueInput;
        select?: Prisma.UrlSelect;
    }) {
        return (prisma as any)[this.modelName].update({
            where,
            data: {deletedAt: new Date(), isDeleted: true},
            select
        });
    }
}
