import { Router } from "express";
import {  checkEmail, forgotPassword, getAllUser, getUser, phone, register, resetPassword, updateUser, verifyForgotOtp, verifyotp } from "../../controller/authController.js";
import { authJwt } from "../../middlewares/authjwt.js";


const router = Router();
  
router.route('/phone').post(phone)
router.route('/verifyotp').post(verifyotp)
router.route('/register').post(register);
router.route('/checkEmail').post(checkEmail)
router.route('/forgotPassword').post(forgotPassword)
router.route('/verifyForgotOtp').post(verifyForgotOtp)
router.route('/resetPassword').post(resetPassword)
router.route('/updateUser').put(updateUser)
router.route('/getUser').get(getUser)
router.route('/getAllUser').get(authJwt,getAllUser)

export default router;
