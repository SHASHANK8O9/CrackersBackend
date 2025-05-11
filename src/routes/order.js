// routes/orderRoutes.js (example)
import express from "express";
import { createOrder, getAllOrders } from "../controllers/order.js";

const router = express.Router();

router.post("/", createOrder); // Assuming your endpoint is POST /api/orders
router.get("/", getAllOrders); // Assuming your endpoint is POST /api/orders

export const orderRoutes = router;
