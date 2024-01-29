import { string } from "joi";
import mongoose from "mongoose";
import { APP_URL } from "../config";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: {
      type: String,
      required: true,
      get: (image) => {
        return `${APP_URL}/${image}`; // to give orginal path in database for the image when client ask for the products
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Product", productSchema);
