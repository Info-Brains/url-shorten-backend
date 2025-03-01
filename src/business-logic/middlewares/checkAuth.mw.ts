import AuthService from "@business/services/auth.service";
import {Request, Response, NextFunction} from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '').trim();
        console.log(token)

        if (!token) {
            return next({
                status: 401,
                message: 'Unauthorized',
                error: {
                    code: "NO_TOKEN_FOUND",
                    details: "Unauthorized access"
                },
            })
        }

        // Verify token
        const decoded = AuthService.verifyToken(token);

        if (!decoded) {
            return next({
                status: 401,
                message: 'Unauthorized',
                error: {
                    code: "INVALID_TOKEN",
                    details: "Invalid token"
                },
            })
        }

        req.user = decoded;

        return next();
    } catch (error) {
        console.error('Error in authMiddleware', error);
        return next({
            status: 500,
            message: 'Internal Server Error',
            error: {
                code: "INTERNAL_SERVER_ERROR",
                details: "Internal Server Error",
            },
        });
    }
}

export default authMiddleware;