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
    categories,
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
    categories,
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

export const getProducts = asyncErrorHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (category) {
    filter.categories = new mongoose.Types.ObjectId(category);
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    ProductModel.find(filter).populate("categories").skip(skip).limit(limitNum),
    ProductModel.countDocuments(filter),
  ]);

  res.status(200).json({
    status: true,
    message: "Product Fetched Successfully !!",
    data: products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
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
