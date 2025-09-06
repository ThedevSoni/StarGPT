import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body, // raw body होना चाहिए (express.raw middleware use करना पड़ेगा route में)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { transactionId, appId } = session.metadata;

        if (appId === "stargpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          if (transaction) {
            // Update user credits
            await User.updateOne(
              { _id: transaction.userId },
              { $inc: { credits: transaction.credits } }
            );

            // Update transaction payment status
            transaction.isPaid = true;
            await transaction.save();
          }
        } else {
          return response.json({
            received: true,
            message: "Ignored event: Invalid app",
          });
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    response.status(500).send("Internal Server Error");
  }
};
