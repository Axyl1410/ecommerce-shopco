import { SePayPgClient } from "sepay-pg-node";
import { assertValue } from "./utils";

const MERCHANT_ID = assertValue(
  process.env.SEPAY_MERCHANT_ID,
  "SEPAY_MERCHANT_ID is not set",
);
const SECRET_KEY = assertValue(
  process.env.SEPAY_SECRET_KEY,
  "SEPAY_SECRET_KEY is not set",
);

const client = new SePayPgClient({
  env: "sandbox",
  merchant_id: MERCHANT_ID,
  secret_key: SECRET_KEY,
});

export default client;
