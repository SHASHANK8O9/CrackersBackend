// emailService.js
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helper functions for EJS
const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

const getShortId = (id) => (id ? id.toString().slice(-8).toUpperCase() : "N/A");

/**
 * Sends an enquiry confirmation email based on the OrderModel structure.
 * @param {object} enquiryDocument - The saved Mongoose document (instance of OrderModel).
 * @returns {Promise<string>} - A promise that resolves with a success message or rejects with an error.
 */
export const sendEnquiryMail = async (enquiryDocument) => {
  // enquiryDocument is an instance of your OrderModel
  // It will have fields like: enquiryDocument.fullName, enquiryDocument.email,
  // enquiryDocument.phone, enquiryDocument.address, enquiryDocument.orderNotes,
  // enquiryDocument.orderItems, enquiryDocument._id, enquiryDocument.createdAt (if timestamps: true)

  console.log(
    `Sending enquiry mail for Ref: ${enquiryDocument._id} to ${enquiryDocument.email}`
  );
  console.log(
    chalk.bgYellowBright(
      `${process.env.NODEMAILER_EMAIL} and pass ${process.env.NODEMAILER_PASSWORD}`
    )
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  // Path to your EJS template for enquiries
  const templatePath = path.join(__dirname, "../views/orderMail.ejs");

  // Data to be passed to the EJS template
  const emailRenderData = {
    enquiry: enquiryDocument, // Pass the whole Mongoose document
    formatDate,
    getShortId,
    // No formatCurrency as OrderModel doesn't strictly define prices for items in [{}]
  };

  try {
    const htmlContent = await ejs.renderFile(templatePath, emailRenderData);

    const recipients = [enquiryDocument.email, process.env.NODEMAILER_EMAIL]; // User who made the enquiry

    const mailOptions = {
      from: `"Nammapettikadai" <${process.env.NODEMAILER_EMAIL}>`,
      to: recipients,
      subject: `Enquiry Received - Ref: ${getShortId(
        enquiryDocument._id
      )} - Nammapettikadai`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Enquiry Mail Sent Successfully for Ref ${enquiryDocument._id}: ${info.response}`
    );
    return `Enquiry Mail Sent Successfully for Ref ${enquiryDocument._id}: ${info.response}`;
  } catch (error) {
    console.error(
      `Error rendering EJS or sending mail for Enquiry Ref ${enquiryDocument._id}:`,
      error
    );
    throw error;
  }
};
