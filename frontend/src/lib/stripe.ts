import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(
  // todo: use later for production
  // assertValue(process.env.STRIPE_SECRET_KEY, "Missing STRIPE_SECRET_KEY")
  process.env.STRIPE_SECRET_KEY as string,
);
