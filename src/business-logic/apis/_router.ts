import CheckAuthMw from "@business/middlewares/checkAuth.mw"
import PrivateRouter from "./private";
import PublicRouter from "./public";
import { Router } from "express";

const router = Router();

router.use('/public', PublicRouter);
router.use('/private', CheckAuthMw, PrivateRouter);

export default router;
