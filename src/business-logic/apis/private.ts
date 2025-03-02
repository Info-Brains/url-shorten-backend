import UrlController from "@business/controllers/private/url.controller";
import { Router } from "express";

const router = Router();

router.get('/urls', UrlController.getAllUrls);
router.get('/urls/:id', UrlController.getUrl);
router.post('/urls', UrlController.createUrl);
router.patch('/urls/:id', UrlController.updateUrl);
router.delete('/urls/:id', UrlController.deleteUrl);

export default router;
