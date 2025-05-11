// -----------------------------------------------Imports-------------------------------------------------------
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongo } from "./src/configs/db/mongo/mongoConfig.js";
import { envAccess } from "./src/utils/index.js";
import { CustomError } from "./src/utils/errors/customError.js";
import morgan from "morgan";
import { ProductRoutes } from "./src/routes/productRoutes.js";
import { CategoryRoutes } from "./src/routes/categoryRoutes.js";
import { orderRoutes } from "./src/routes/order.js";

// -------------------------------------------------------------------------------------------------------------
dotenv.config();

const app = express();
const PORT = envAccess("PORT") || 9998;
connectMongo();

// ------------------------------------------------------------------------------------------------------------
// ----------------------------------------------CORS HANDLING-------------------------------------------------
app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? {
          origin: [
            "https://nammapettikadai.in",
            "https://www.nammapettikadai.in",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5010",
            "http://localhost:4113",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:4114",
          ],
          credentials: true,
        }
      : {
          origin: [
            "https://nammapettikadai.in",
            "https://www.nammapettikadai.in",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5173",
            "http://localhost:5010",
            "http://localhost:4113",
            "http://localhost:4114",
          ],
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          credentials: true,
          maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
  )
);
// ------------------------------------------------------------------------------------------------------------
// ----------------------------------------------Middlewares----------------------------------------------------
// express.json() -- middleware to parse the json coming from the http request
app.use(express.json());

// cookieParser() -- middleware to parse the cookie coming from the http request
app.use(cookieParser());
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------Routes----------------------------------------------------

const versionOne = (url) => {
  return `/api/v1/${url}`;
};

// Router Imports

app.use(morgan("dev"));
// Express session

app.all(["/", "/api", "/api/v1"], (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Cracker Site !!",
  });
});

app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/categories", CategoryRoutes);
app.use("/api/v1/orders", orderRoutes);

// -------------------------------------------------------------------------------------------------------------

// ------------------------------------------Global Error Handling----------------------------------------------

app.all("*", (req, res, next) => {
  return next(
    new CustomError(`Can't find the ${req.originalUrl} on the server`, 404)
  );
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message,
  });
});

// ------------------------------------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running at port - ${PORT}`);
});
// ------------------------------------------------------------------------------------------------------------
