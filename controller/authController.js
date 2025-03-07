import { sendResponse } from "../utils/responseHelper.js";
import models from "../models/index.js";
import bcrypt from "bcrypt";
import sendEmail from "../helper/email.js"
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/helper.js";


export const phone = async (req, res, next) => {
    try {
      console.log("====>>>>here")
        const { countryCode,phone,iso } = req.body;
      console.log("req.body",req.body)
        if (!phone || !iso || !countryCode  ) {
            return sendResponse(req, res, 400, "Phone,countryCode and iso number is required", {});
        }

        let user = await models.User.findOne({ phone });

        if (user) {
          const otp = Math.floor(100000 + Math.random() * 900000);
          const otpExpires = new Date(Date.now() + 10 * 60000);

          user = await models.User.findOneAndUpdate({_id:user._id},{ countryCode,phone,iso, otp, otpExpires },{new:true});

          return sendResponse(req, res, 200, "OTP sent successfully", { 
            _id: user._id, 
              phone:{
              countryCode:user.countryCode,
              phone: user.phone, 
              iso:user.iso,
              },
              otp
          });
      } else {
            
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpires = new Date(Date.now() + 10 * 60000);

            user = await models.User.create({ countryCode,phone,iso, otp, otpExpires });

            return sendResponse(req, res, 200, "OTP sent successfully", { 
                _id: user._id, 
                phone:{
                  countryCode:user.countryCode,
                  phone: user.phone, 
                  iso:user.iso,
                  },
                otp
            });
        }

    } catch (error) {
        next(error);
    }
};
export const verifyotp = async (req,res,next) => {
  try {
    const {id, otp} = req.body;
    if(!id || !otp) {
      return sendResponse(req, res, 400, "Id and Otp is required", {});
    }
    const storedotp = await models.User.findById(id);
    if(!storedotp){
      return sendResponse(req, res, 404, "User not found", {});
    }
    if(storedotp.otp != otp){
      return sendResponse(req, res, 400, "Otp did not match", {});
    }
    const user = await models.User.findById(id)
    let profileStatus = user.myProfileStatus
    if(user.myProfileStatus){
      const expiresIn = process.env.JWT_EXPIRATION_TIME

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn }
      );

      const expiresAt = new Date(Date.now() + jwt.decode(token).exp * 1000 - jwt.decode(token).iat * 1000)
        .toLocaleString("en-GB", { hour12: false })
        .replace(",", "");

      return sendResponse(req, res, 200, "User login successfully",{token,expiresAt,profileStatus});
    }
    else{
      const token = ""
      const expiresAt = ""
      return sendResponse(req, res, 200, "otp verified successfully",{token,expiresAt,profileStatus});
    }
   
  } catch (error) {
    next(error);
  }
};
export const checkEmail = async (req,res,next) => {
  try {
    const {name,email,password} = req.body;
    if(!name ||!email ||!password) {
      return sendResponse(req, res, 400, "name, email, and password are required", {});
    }
    const existingUser = await models.User.findOne({email});
    if(existingUser){
      return sendResponse(req, res, 200, "This email already exists", {});
    }
    sendResponse(req, res, 200, "You can proceed with this email", {});
  } catch (error) {
    next(error)
  }
};
export const register = async (req, res, next) => {
  try {
    const { id,image, dob, gender, list, name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendResponse(req, res, 400, "name, email, and password are required", {});
    }

    const hashedPassword = await hashPassword(password);
    const users = await models.User.findOne({ email });
    const imageArray = typeof image === "string" ? image.split(",") : image;
    const listArray = typeof list === "string" ? list.split(",") : list;

    const isProfileComplete = image && dob && gender && list && name && email && password;
   
    const user = await models.User.findByIdAndUpdate(
      id,{
      ...req.body,
      image:imageArray,
      list: listArray,
      password: hashedPassword,
      myProfileStatus: isProfileComplete ? true : false, 
      
    },{ new: true });
 
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
      );

    sendResponse(req, res, 200, "User created successfully", { _id: user._id,
      name: user.name,
      email: user.email,
      phoneDetails: {
        countryCode: user.countryCode,
        phone: user.phone,
        iso: user.iso,
      },
      image: user.image,
      dob: user.dob,
      gender: user.gender,
      list: user.list,
      myProfileStatus: user.myProfileStatus,
      token, });
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(req, res, 400, "Email is required", {});
    }
    const user = await models.User.findOne({ email });
    if (!user) {
      return sendResponse(req, res, 404, "Email not found", {});
    }
    const isForgotOtp = Math.floor(100000 + Math.random() * 900000);

    await sendEmail(email, `Your OTP is: ${isForgotOtp  }`);

    user.isForgotOtp = isForgotOtp;
    console.log("isForgotOtp", isForgotOtp)

    await user.save();

    return sendResponse(req, res, 200, "OTP sent successfully", { id: user._id,otp: user.isForgotOtp }); 
  } catch (error) {
    next(error);
  }
}
export const verifyForgotOtp = async (req, res, next) => {
  try {
    const { id, otp } = req.body;
    if (!id ||!otp) {
      return sendResponse(req, res, 400, "Id and Otp is required", {});
    }
    const user = await models.User.findById(id);
   
    if (!user) {
      return sendResponse(req, res, 404, "User not found", {});
    }
    if (user.isForgotOtp != otp) {
      
      return sendResponse(req, res, 400, "Otp did not match", {});
    }
    return sendResponse(req, res,200,"Otp verified successfully",id)
  } catch (error) {
    next(error);
  }
}
export const resetPassword = async (req, res, next) => {
  try {
    const {password, confirmPassword, id } = req.body;
    if (!password ||!confirmPassword ||!id) {
      return sendResponse(req, res, 400, "Password, Confirm Password and Id is required", {});
    }
    if (password!= confirmPassword) {
      return sendResponse(req, res, 400, "Password and Confirm Password did not match", {});
    }
    const hashedPassword = await hashPassword(password);
    const user = await models.User.findByIdAndUpdate(id, { password: hashedPassword },{ new: true });
      sendResponse(req, res, 200, "Password reset successfully", user);
  } catch (error) {
    next(error);
  }
}
