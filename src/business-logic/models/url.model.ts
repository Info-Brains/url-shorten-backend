import prisma from "@config/prisma.config";
import {Prisma} from "@prisma/client";

export default class User {
    private static modelName: string = "Url";

    public static findMany({where, select, page = 1, limit = 10}: {
        where?: Prisma.UserWhereInput;
        select?: Prisma.UserSelect;
        page?: number;
        limit?: number;
    }) {
        const [urls, urlsTotal] = (prisma as any).$transaction([
            (prisma as any)[this.modelName].findMany({where, select, skip: (page - 1) * limit, take: limit}),
            (prisma as any)[this.modelName].count({where})
        ])

        return {urls, urlsTotal};
    }

    public static create({data, select}: {
        data: Prisma.UserCreateInput;
        select?: Prisma.UserSelect;
    }) {
        return (prisma as any)[this.modelName].create({data, select});
    }

    public static update({where, data, select}: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
        select?: Prisma.UserSelect;
    }) {
        return (prisma as any)[this.modelName].update({where, data, select});
    }

    public static delete({where}: {
        where: Prisma.UserWhereUniqueInput;
    }) {
        return (prisma as any)[this.modelName].delete({where});
    }
}
