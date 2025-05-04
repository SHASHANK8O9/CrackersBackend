import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true,
    minlength: [1, "Min Length For Title is 1"],
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // Default discount is 0 if not provided
  },
  banner: {
    type: Object,
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  stockStatus: {
    type: String,
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference the Category model
  },
  quantity: {
    type: String,
  },
  description: {
    type: String,
  },
  discountedPrice: {
    type: Number,
  },
});

productSchema.pre("save", function (next) {
  this.discountedPrice = this.price - (this.price * this.discount) / 100;
  next();
});

export const ProductModel = mongoose.model("Product", productSchema);
