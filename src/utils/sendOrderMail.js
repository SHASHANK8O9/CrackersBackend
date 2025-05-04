import nodemailer from 'nodemailer'
import ejs from "ejs"
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sendOrderMail = async (email, orderId ,amount, date, paymentType,orderType,items,name,mobileNumber,comment,address ) => {
    // transporter - configuration of admin/user to send mail from
    console.log(email,"Inside the sendOrderMail Controller")
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
      
    const templatePath = path.join(__dirname, `../views/orderMail.ejs`);

    let data = await ejs.renderFile(templatePath, { email, orderId, amount, date ,paymentType,orderType,items,name,mobileNumber,comment,address});


    let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: [email,process.env.NODEMAILER_EMAIL],
        subject: "Your Hot House Pizza Order Confirmation",
        html: data,
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending mail:", error);
            return reject(error);  // Reject on error
          } else {
            console.log("Email sent:", info.response);
            return resolve("Order Mail Sent Successfully: " + info.response);  // Resolve with success message
          }
        });
      });
}