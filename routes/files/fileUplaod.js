import { Router } from "express";
import { fileUpdload } from "../../controller/fileUploadController.js";
const router = Router();

router.route('/').post(fileUpdload)

export default router;
