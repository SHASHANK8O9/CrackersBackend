// ---------------------------------------------Imports---------------------------------------------------
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

// -------------------------------------------------------------------------------------------------------

// connectMongo -- function to call in order to connect to the database
export const connectMongo = async () => {
  try {
    // console.log(chalk.bgGreenBright(process.env.MONGO_URL));
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.log(error.message);
  }
};
