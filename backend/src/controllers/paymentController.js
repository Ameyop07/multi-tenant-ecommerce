import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sendEmail, { orderConfirmationTemplate } from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe PaymentIntent for the current cart
// @route   POST /api/payments/create-intent
// @access  Private/Customer
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ product, variantLabel, quantity }]

  let itemsTotal = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    const price = item.variantLabel
      ? product.variants.find((v) => v.label === item.variantLabel)?.price ?? product.basePrice
      : product.basePrice;
    itemsTotal += price * item.quantity;
  }
  const shippingFee = itemsTotal > 100 ? 0 : 9.99;
  const total = Math.round((itemsTotal + shippingFee) * 100); // Stripe expects cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
    metadata: { customerId: req.user._id.toString() },
    automatic_payment_methods: { enabled: true },
  });

  res.json({ clientSecret: paymentIntent.client_secret, amount: total / 100 });
});

// @desc    Stripe webhook — confirms payment & finalizes the order
// @route   POST /api/payments/webhook
// @access  Public (verified via Stripe signature)
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const order = await Order.findOne({ stripePaymentIntentId: intent.id });
    if (order && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      await order.save();

      const customer = await order.populate("customer", "email");
      await sendEmail({
        to: customer.customer.email,
        subject: "Your order is confirmed!",
        html: orderConfirmationTemplate(order),
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: intent.id },
      { paymentStatus: "failed" }
    );
  }

  res.json({ received: true });
});
