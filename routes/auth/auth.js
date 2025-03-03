import { Router } from "express";
import {  phone, register, verifyotp } from "../../controller/authController.js";


const router = Router();

router.route('/phone').post(phone)
router.route('/verifyotp').post(verifyotp)
router.route('/register').post(register);
// router.route('/checkemail').post(checkemail)

export default router;
