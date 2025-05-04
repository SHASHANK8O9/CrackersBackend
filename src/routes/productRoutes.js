import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();

// Create a new product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get a single product by slug
router.get("/:slug", getProductBySlug);

// Update product by ID
router.put("/:id", updateProduct);

// Delete product by ID
router.delete("/:id", deleteProduct);

export const ProductRoutes = router;
