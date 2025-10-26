import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // always store in uppercase
      trim: true
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // % or flat amount
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    minOrderValue: {
      type: Number,
      default: 0 // minimum cart value to apply
    },
    expiryDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true });

  const Coupon = mongoose.model("Coupon", couponSchema);
  export default Coupon;