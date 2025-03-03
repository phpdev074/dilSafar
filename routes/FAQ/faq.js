import { Router } from "express";
import { faq, getFaqInfo, updateFaqInfo } from "../../controller/faqController.js";


const router = Router();

router.route('/').post(faq);
router.route('/getFaqInfo').get(getFaqInfo)
router.route('/updateFaqInfo').put(updateFaqInfo)

export default router;
