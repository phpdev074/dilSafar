import { Router } from "express";
import {  checkEmail, forgotPassword, phone, register, resetPassword, verifyForgotOtp, verifyotp } from "../../controller/authController.js";


const router = Router();
    console.log("===>>inside router")
router.route('/phone').post(phone)
router.route('/verifyotp').post(verifyotp)
router.route('/register').post(register);
router.route('/checkEmail').post(checkEmail)
router.route('/forgotPassword').post(forgotPassword)
router.route('/verifyForgotOtp').post(verifyForgotOtp)
router.route('/resetPassword').post(resetPassword)

export default router;
