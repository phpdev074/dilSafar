import nodemailer from "nodemailer"

export const sendEmail = async(sendEmail,otp) => {
try {
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'phpdev074@gmail.com',
     pass: 'kflwxejztwzejhom',
   },
 });

 transporter.verify(function (error, success) {
   if (error) {
     console.error(error);
   } else {
     console.log('Transporter is ready to send emails');
   }
 });
const sendEmail = async (to, subject, html) => {
 const mailOptions = {
   from: 'phpdev074@gmail.com',
   to,
   subject: "Your OTP Code",
   text: `Your OTP COde is:${otp}`
 };

   const info = await transporter.sendMail(mailOptions);
   console.log('Email sent: ', info.messageId);
 }} catch (error) {
   console.error('Error sending email: ', error);
 }
}
