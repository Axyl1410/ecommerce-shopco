import { SePayPgClient } from "sepay-pg-node";

const client = new SePayPgClient({
  env: "sandbox",
  merchant_id: "SP-TEST-NT939B79",
  secret_key: "spsk_test_PQAiQ8QErefQ3YZpfQx3a3tPvYaECeJt",
});

export default client;
