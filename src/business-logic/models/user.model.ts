import prisma from "@config/prisma.config";
import {Prisma} from "@prisma/client";

export default class User {
    private static modelName: string = "User";

    public static findUnique({where, select}: {
        where: Prisma.UserWhereUniqueInput;
        select?: Prisma.UserSelect;
    }) {
        return (prisma as any)[this.modelName].findUnique({where, select});
    }

    public static findFirst({where}: {
        where: Prisma.UserWhereInput
    }) {
        return (prisma as any)[this.modelName].findFirst({where});
    }

    public static create({data, select}: {
        data: Prisma.UserCreateInput;
        select?: Prisma.UserSelect;
    }) {
        return (prisma as any)[this.modelName].create({data, select});
    }
}
