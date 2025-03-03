import { Router } from "express";
import { createProduct, deleteProduct, getDetailProduct, getListProduct } from "../../controller/productController.js";


const router = Router();

router.route('/').post(createProduct).get(getListProduct).delete(deleteProduct)
router.route('/detail').get(getDetailProduct)


export default router;
