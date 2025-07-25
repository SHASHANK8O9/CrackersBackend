import CategoryModel from "../models/catgeory.js";
import { asyncErrorHandler } from "../utils/errors/asyncErrorHandler.js";
// @desc    Create a new category
// @route   POST /api/categories
// @access  Public or Protected
export const createCategory = asyncErrorHandler(async (req, res) => {
  const { title, banner } = req.body;

  const categoryExists = await CategoryModel.findOne({ title });
  if (categoryExists) {
    res.status(400).json({ status: false, message: "Category already exists" });
  }

  const category = await CategoryModel.create({
    title,
    banner,
  });

  res.status(201).json({
    status: true,
    message: "Category Created Successfully !!",
    data: category,
  });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncErrorHandler(async (req, res) => {
  const categories = await CategoryModel.find();
  res.status(200).json({
    status: true,
    message: "Categories Fetched SuccessFully !!",
    data: categories,
  });
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);

  if (!category)
    return res
      .status(404)
      .json({ status: false, message: "Category not found !!" });

  res.status(200).json({
    status: true,
    message: "Catgeory Fetched Succefully !!",
    data: category,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Protected (Admin typically)
export const updateCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const category = await CategoryModel.findById(id);

  if (category) {
    Object.assign(category, updates);
    const updatedCategory = await category.save();
    res.status(200).json({ status: true, data: updatedCategory });
  } else {
    res.status(404).json({ status: true, message: "Category not found" });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Protected (Admin typically)
export const deleteCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(404).json({ status: true, message: "Category not found" });
  }
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return res
      .status(404)
      .json({ status: true, message: "Failed To Delete Category !!" });
  }

  res
    .status(200)
    .json({ status: true, message: "Category Deleted Successfully !!" });
});
