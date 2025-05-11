// orderController.js (or enquiryController.js)
import { OrderModel } from "../models/order.js";
import { asyncErrorHandler } from "../utils/errors/asyncErrorHandler.js";
import { sendEnquiryMail } from "../utils/sendOrderMail.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  // Destructure fields from your OrderModel schema
  const {
    fullName,
    email,
    phone,
    address,
    orderNotes,
    orderItems, // This is the array of objects for items of interest
  } = req.body;

  // --- Basic Validations (as per your OrderModel 'required' fields) ---
  if (!fullName || !email || !phone || !address) {
    return res.status(400).json({
      status: false,
      message:
        "Missing required fields: fullName, email, phone, and address are required.",
    });
  }
  // You might add validation for orderItems if it's considered essential for an enquiry

  // --- Create and Save Enquiry Record using OrderModel ---
  const newEnquiry = new OrderModel({
    fullName,
    email,
    phone,
    address,
    orderNotes,
    orderItems,
    // If your schema has timestamps: true, createdAt and updatedAt will be added automatically
  });

  const savedEnquiryDocument = await newEnquiry.save();

  // --- Send Enquiry Confirmation Email ---
  if (savedEnquiryDocument) {
    try {
      // Pass the full saved Mongoose document
      await sendEnquiryMail(savedEnquiryDocument);
      console.log(
        `Enquiry confirmation email process initiated for ${savedEnquiryDocument.email}`
      );
    } catch (emailError) {
      console.error(
        `Enquiry ${savedEnquiryDocument._id} recorded, but failed to send confirmation email:`,
        emailError.message
      );
    }
  }

  res.status(201).json({
    status: true,
    message: "Enquiry submitted successfully! We will get back to you soon.",
    data: savedEnquiryDocument,
  });
});

export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const data = await OrderModel.find();

  return res.status(200).json({
    status: true,
    messgae: "Data Fetched Successfully !!",
    data,
  });
});
