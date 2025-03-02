import PaginationValidator from '@business/validators/paginations.validator';
import UrlSchemaValidator from '@business/validators/url.validator';
import {Request, Response, NextFunction} from 'express';
import UrlModel from "@business/models/url.model";
import ENV from "@config/env.config";

class UrlController {
    public static createUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {error, value} = UrlSchemaValidator.urlValidator.validate(req.body);

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

            const createdUrl = await UrlModel.create({
                data: {
                    originalUrl: value.url,
                    user: {connect: {id: req.user.id}}
                },
                select: {
                    id: true,
                    originalUrl: true,
                    clicks: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            const shortUrl = `${ENV.BASE_URL}/shorten/${createdUrl.id}`;

            res.status(201).json({
                message: "Url shortened successfully",
                data: {
                    shortUrl,
                    ...createdUrl,
                },
            });
        } catch (error) {
            console.error('Error in UrlController.createUrl:', error);
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    }

    public static getAllUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {error, value} = PaginationValidator.paginationSchema.validate(req.query);

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

            const data = await UrlModel.findMany({
                where: {
                    user: {id: req.user.id},
                    isDeleted: false,
                },
                select: {
                    id: true,
                    originalUrl: true,
                    clicks: true,
                    createdAt: true,
                    updatedAt: true,
                },
                page: value.page,
                limit: value.limit,
            });

            data.urls.forEach((url: { id: any; shortUrl: string; }) => {
                url.shortUrl = `${ENV.BASE_URL}/shorten/${url.id}`;
            });

            res.status(200).json({
                message: "Urls fetched successfully",
                data: data.urls,
                pagination: {
                    page: value.page,
                    limit: value.limit,
                    totalElements: data.urlsTotal,
                    totalPages: Math.ceil(data.urlsTotal / value.limit),
                    hasNext: value.page < Math.ceil(data.urlsTotal / value.limit),
                    hasPrevious: value.page > 1,
                }
            });
        } catch
            (error) {
            console.error('Error in UrlController.getAllUrls:', error);
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    }

    public static getUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const url = await UrlModel.findOne({
                where: {
                    id: req.params.id,
                    user: {id: req.user.id},
                    isDeleted: false,
                },
                select: {
                    id: true,
                    originalUrl: true,
                    clicks: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            if (!url) {
                return next({
                    status: 404,
                    message: "Url not found",
                    error: {
                        code: "NOT_FOUND",
                        details: "Url not found",
                    },
                });
            }

            url.shortUrl = `${ENV.BASE_URL}/shorten/${url.id}`;

            res.status(200).json({
                message: "Url fetched successfully",
                data: url,
            });
        } catch (error) {
            console.error('Error in UrlController.getUrl:', error);
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    }

    public static updateUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {error, value} = UrlSchemaValidator.urlValidator.validate(req.body);

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

            const url = UrlModel.findOne({
                where: {id: req.params.id, user: {id: req.user.id}}
            });

            if (!url) {
                return next({
                    status: 404,
                    message: "Url not found",
                    error: {
                        code: "NOT_FOUND",
                        details: "Url not found",
                    },
                });
            }

            const updatedUrl = await UrlModel.update({
                where: {id: req.params.id},
                data: {
                    originalUrl: value.url,
                },
                select: {
                    id: true,
                    originalUrl: true,
                    clicks: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            updatedUrl.shortUrl = `${ENV.BASE_URL}/shorten/${updatedUrl.id}`;

            res.status(200).json({
                message: "Url updated successfully",
                data: updatedUrl,
            });
        } catch (error) {
            console.error('Error in UrlController.updateUrl:', error);
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    }

    public static deleteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const url = await UrlModel.findOne({
                where: {
                    id: req.params.id,
                    user: {id: req.user.id},
                    isDeleted: false,
                }
            });

            if (!url) {
                return next({
                    status: 404,
                    message: "Url not found",
                    error: {
                        code: "NOT_FOUND",
                        details: "Url not found",
                    },
                });
            }

            await UrlModel.softDelete({
                where: {id: req.params.id}
            });

            res.status(200).json({
                status: 200,
                message: "Url deleted successfully",
            });
        } catch (error) {
            console.error('Error in UrlController.deleteUrl:', error);
            return next({
                status: 500,
                message: "Internal Server Error",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    details: "Internal Server Error",
                },
            });
        }
    }
}

export default UrlController;
