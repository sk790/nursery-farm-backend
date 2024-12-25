import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const proccesPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    description: req.body.description,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });
  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

// exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
//   res.status(200).json({
//     stripeApiKey: process.env.STRIPE_API_KEY,
//   });
// });
