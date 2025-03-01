import AuthValidator from "@business/validators/auth.validator";
import HashService from "@business/services/hash.service";
import AuthService from "@business/services/auth.service";
import {Request, Response, NextFunction} from "express";
import UserModel from "@business/models/user.model";

class AuthController {
    public static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {error, value} = AuthValidator.registrationSchema.validate(req.body);

            if (error) {
                return next({
                    status: 400,
                    message: error.details[0].message,
                    error: {
                        code: "VALIDATION_ERROR",
                        details: error.details[0].message,
                    },
                });
            }

            const isEmailExist = await UserModel.findFirst({
                where: {email: value.email}
            });

            if (isEmailExist) {
                return next({
                    status: 409,
                    message: "Email already exist",
                    error: {
                        code: "EMAIL_EXISTS",
                        details: "The email address is already registered",
                    },
                });
            }

            const hashedPassword = HashService.hash(value.password, 12);
            let newUser = await UserModel.create({
                data: {
                    name: value.name,
                    email: value.email,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            const accessToken = AuthService.generateToken(newUser, "90d");

            res.status(201).json({
                message: "Registration successful. Please verify your email.",
                data: {
                    user: newUser,
                    accessToken: accessToken,
                }
            });
        } catch (error) {
            console.log(error);
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    };

    public static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {error, value} = AuthValidator.loginSchema.validate(req.body);

            if (error) {
                return next({
                    status: 400,
                    message: error.details[0].message,
                    error: {
                        code: "VALIDATION_ERROR",
                        details: error.details[0].message,
                    },
                });
            }

            const user = await UserModel.findUnique({
                where: {email: value.email},
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                },
            });

            if (!user) {
                return next({
                    status: 400,
                    message: "Invalid Email",
                    error: {
                        code: "INVALID_EMAIL",
                        details: "The provided email is incorrect",
                    },
                });
            }

            const isMatch = HashService.compare(value.password, user.password);

            if (!isMatch) {
                return next({
                    status: 400,
                    message: "Invalid password",
                    error: {
                        code: "INVALID_PASSWORD",
                        details: "The provided password is incorrect",
                    },
                });
            }

            delete user.password;
            const accessToken = AuthService.generateToken(user, "90d");

            res.status(200).json({
                message: "login succefull",
                data: {
                    user: user,
                    accessToken: accessToken,
                },
            });
        } catch (error) {
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    };
}

export default AuthController;
