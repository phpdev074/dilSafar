import { Router } from "express";
import {pages, getPageInfo, updatePageInfo} from "../../controller/pagesController.js";


const router = Router();

router.route('/').post(pages).get(getPageInfo).put(updatePageInfo)

export default router;
