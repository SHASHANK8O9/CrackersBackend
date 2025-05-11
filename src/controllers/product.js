import chalk from "chalk";
import catgeory from "../models/catgeory.js";
import { ProductModel } from "../models/product.js";
import { asyncErrorHandler } from "../utils/errors/asyncErrorHandler.js";
import mongoose from "mongoose";
// @desc    Create a new product
// @route   POST /api/products
// @access  Public or Protected (based on your app)
export const createProduct = asyncErrorHandler(async (req, res) => {
  const {
    title,
    price,
    discount,
    banner,
    slug,
    stockStatus,
    category,
    quantity,
    description,
  } = req.body;

  const product = new ProductModel({
    title,
    price,
    discount,
    banner,
    slug,
    stockStatus,
    categories: category,
    quantity,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json({
    status: true,
    message: "Product Created Successfully",
    data: createdProduct,
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public

// Assuming these are imported or available in the scope:
// const mongoose = require('mongoose'); // or import mongoose from 'mongoose';
// const ProductModel = require('./models/ProductModel'); // Or your actual path
// const CategoryModel = require('./models/CategoryModel'); // Or your actual path, corrected typo
// const asyncErrorHandler = require('./utils/asyncErrorHandler'); // Or your actual path
// const chalk = require('chalk'); // or import chalk from 'chalk';

export const getProducts = asyncErrorHandler(async (req, res) => {
  // 1. Extract Query Parameters and Set Defaults
  const {
    category,
    cat,
    page: pageQuery = 1,
    limit: limitQuery = 10,
  } = req.query;

  const filter = {};

  // 2. Construct Filter Object
  // Handle 'category' (direct ObjectId)
  if (category) {
    if (category !== "ALL") {
      // Ensure 'category' is a valid ObjectId string before attempting to convert
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.categories = new mongoose.Types.ObjectId(category);
      } else {
        // Handle invalid ObjectId for 'category' - perhaps return an error or an empty set
        // For now, we'll log and proceed, which might lead to no results for this specific filter
        console.warn(
          chalk.yellow(
            `Warning: Invalid ObjectId provided for 'category': ${category}`
          )
        );
        // To ensure no results for an invalid category ID, you could do:
        // filter.categories = new mongoose.Types.ObjectId('000000000000000000000000');
      }
    }
    // If category === "ALL", no specific category filter is applied based on 'category' param.
  }

  // Handle 'cat' (search by category title, case-insensitive)
  // This will override the 'category' filter if 'cat' is also provided and a match is found.
  if (cat) {
    try {
      const categoryDoc = await catgeory.findOne({
        _id: cat,
      });
      if (categoryDoc) {
        filter.categories = new mongoose.Types.ObjectId(categoryDoc._id);
      } else {
        // If 'cat' is specified but no category is found,
        // ensure no products are returned for this specific 'cat' criterion.
        // We can do this by setting 'categories' to a non-existent ObjectId.
        filter.categories = new mongoose.Types.ObjectId(
          "000000000000000000000000"
        ); // Dummy non-existent ID
      }
      console.log(
        chalk.bgBlueBright(
          "Filter after 'cat' processing:",
          JSON.stringify(filter)
        )
      );
    } catch (error) {
      // Handle potential errors during CategoryModel.findOne, e.g., database issues
      console.error(chalk.red("Error finding category by title:", error));
      // Depending on desired behavior, you might want to return an error response here
      // For now, we'll let it proceed, which might mean 'filter.categories' isn't set by 'cat'
    }
  }

  // 3. Pagination Logic
  const pageNum = parseInt(pageQuery, 10) || 1; // Default to 1 if parsing fails or not provided
  const limitNum = parseInt(limitQuery, 10) || 10; // Default to 10
  const skip = (pageNum - 1) * limitNum;

  console.log("Final filter being applied:", filter);

  // 4. Fetch Data from Database
  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .populate("categories") // Assuming 'categories' is a ref field in ProductModel
      .skip(skip)
      .limit(limitNum)
      .lean(), // Using .lean() for better performance if you don't need Mongoose documents
    ProductModel.countDocuments(filter),
  ]);

  // 5. Send Response
  res.status(200).json({
    status: true,
    message: "Products Fetched Successfully !!",
    data: products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: skip + products.length < total,
      hasPrevPage: pageNum > 1,
    },
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncErrorHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await ProductModel.findOne({ slug }).populate("categories");

  if (!product) {
    return res.status(404).json({
      status: true,
      message: "Product Not Found !!",
    });
  }

  res.status(200).json({
    status: true,
    message: "Product Fetched Successfully ",
    data: product,
  });
});
export const getProductById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findOne({ _id: id }).populate(
    "categories"
  );

  if (!product) {
    return res.status(404).json({
      status: true,
      message: "Product Not Found !!",
    });
  }

  res.status(200).json({
    status: true,
    message: "Product Fetched Successfully ",
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Protected (Admin typically)
export const updateProduct = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const product = await ProductModel.findById(id);

  if (product) {
    Object.assign(product, updates);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Protected (Admin typically)
export const deleteProduct = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    return res
      .status(500)
      .json({ status: false, message: "Failed To Delete !!" });
  }

  res
    .status(200)
    .json({ status: true, message: "Deleted Product SuccessFully !!" });
});
