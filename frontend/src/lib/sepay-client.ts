import { SePayPgClient } from "sepay-pg-node";

// Make SePay optional for development
const MERCHANT_ID = process.env.SEPAY_MERCHANT_ID || "dummy-merchant-id";
const SECRET_KEY = process.env.SEPAY_SECRET_KEY || "dummy-secret-key";

const client = new SePayPgClient({
  env: "sandbox",
  merchant_id: MERCHANT_ID,
  secret_key: SECRET_KEY,
});

export default client;
