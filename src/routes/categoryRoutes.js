import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router();

// Create a new category
router.post("/", createCategory);

// Get all categories
router.get("/", getCategories);

// Get single category by ID
router.get("/:id", getCategoryById);

// Update category
router.patch("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

export const CategoryRoutes = router;
