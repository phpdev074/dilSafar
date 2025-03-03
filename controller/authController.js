import { sendResponse } from "../utils/responseHelper.js";
import models from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/helper.js";

export const phone = async (req, res, next) => {
    try {
        const { phone } = req.body;
        console.log("req.body",req.body)
        if (!phone) {
            return sendResponse(req, res, 400, "Phone number is required", {});
        }

        let user = await models.User.findOne({ phone });

        if (user) {
          const otp = Math.floor(100000 + Math.random() * 900000);
          const otpExpires = new Date(Date.now() + 10 * 60000);

          user = await models.User.findOneAndUpdate({ phone, otp, otpExpires });

          return sendResponse(req, res, 200, "OTP sent successfully", { 
              _id: user._id, 
              phone: user.phone, 
              otp
          });
      } else {
            
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpires = new Date(Date.now() + 10 * 60000);

            user = await models.User.create({ phone, otp, otpExpires });

            return sendResponse(req, res, 200, "OTP sent successfully", { 
                _id: user._id, 
                phone: user.phone, 
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
    if(user.myProfileStatus){
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
      );
      return sendResponse(req, res, 200, "User login successfully",token)
    }
    return sendResponse(req, res,200,"Otp verified successfully",id)
  } catch (error) {
    next(error);
  }
};
export const register = async (req, res, next) => {
  try {
    const { id,image, dob, gender, address, name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendResponse(req, res, 400, "name, email, and password are required", {});
    }

    const existingUser = await models.User.findOne({ email });

    if (existingUser) {
      return sendResponse(req, res, 400, "user_already_exist", {});
    }

    const hashedPassword = await hashPassword(password);

    const isProfileComplete = image && dob && gender && address && name && email && password;
   
    const user = await models.User.findByIdAndUpdate(
      id,{
      ...req.body,
      password: hashedPassword,
      myProfileStatus: isProfileComplete ? true : false, 
    },{ new: true });
 
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
      );

    sendResponse(req, res, 200, "user_created", { user, token });
  } catch (error) {
    next(error);
  }
};

