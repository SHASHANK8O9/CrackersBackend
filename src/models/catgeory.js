import mongoose from "mongoose";
import { ProductModel } from "./product.js";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    banner: {
      type: {},
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await ProductModel.deleteMany({ category: doc._id });
  }
});

export default mongoose.model("Category", categorySchema, "categories");
