import stripe from "../config/stripe.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // stripe works in cents
    currency: currency || "usd",
    payment_method_types: ["card"],
  });

  res.status(200).json(
    new ApiResponse(200, {
      clientSecret: paymentIntent.client_secret,
    }, "Payment intent created")
  );
});

export { createPaymentIntent };