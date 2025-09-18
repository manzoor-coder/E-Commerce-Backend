import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one wishlist per user
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ]
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
