import { Router } from "express";
import {pages, getPageInfo, updatePageInfo} from "../../controller/pagesController.js";


const router = Router();

router.route('/').post(pages);
router.route('/getPageInfo').get(getPageInfo)
router.route('/updatePageInfo').put(updatePageInfo)

export default router;
