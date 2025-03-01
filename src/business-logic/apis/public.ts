import AuthController from "@business/controllers/public/auth.controller";
import { Router } from "express";

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

export default router;
