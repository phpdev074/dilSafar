import { Router } from "express";
import { contact_us, getContactUsInfo,deletePost, createfeedBack, getFeedBack } from "../../controller/contactUsController.js";


const router = Router();

router.route('/').post(contact_us);
router.route('/getContactUsInfo').get(getContactUsInfo)
router.route('/deletePost').delete(deletePost)
router.route('/feedBack').post(createfeedBack).get(getFeedBack)

export default router;
