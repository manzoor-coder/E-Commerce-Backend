import stripe from "../config/stripe.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Order from "../models/order.models.js";

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency, orderId } = req.body;

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  // 1️⃣ Create PaymentIntent in Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe works in cents
    currency: currency || "usd",
    payment_method_types: ["card"],
  });

  // 2️⃣ Find order and attach paymentIntent.id
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentInfo = {
        id: paymentIntent.id,
        status: paymentIntent.status,
      };
      await order.save();
    }
  }

  // 3️⃣ Return clientSecret & paymentIntentId
  res.status(200).json(
    new ApiResponse(
      200,
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      "Payment intent created"
    )
  );
});

export { createPaymentIntent };
