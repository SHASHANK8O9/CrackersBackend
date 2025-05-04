import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("auth", authSchema, "auth");
