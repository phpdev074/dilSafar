import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()
// console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)
export const sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',  
        port: 587,                    
        auth: {
          user: process.env.EMAIL_USER,  
          pass: process.env.EMAIL_PASS,  
        },
      });
      

    const mailOptions = {
      from: 'Sender Name <sender@example.com>',  
      to: 'Recipient <recipient@example.com>',                 
      subject: 'Your OTP Code',      
      text: `Your OTP code is: ${otp}`,  
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
