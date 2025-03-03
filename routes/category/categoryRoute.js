import { Router } from "express";
import { createCategory, deletePost, getDetailCategory, getListCategory } from "../../controller/categoryController.js";


const router = Router();

router.route('/').post(createCategory).get(getListCategory).delete(deletePost)
router.route('/detail').get(getDetailCategory)


export default router;
