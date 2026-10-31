import type { PaymentProvider } from "./types";

/**
 * Pesapal v3 outline (implement against https://developer.pesapal.com):
 *   1. POST /api/Auth/RequestToken with consumer key + secret  -> bearer token
 *   2. POST /api/URLSetup/RegisterIPN                           -> ipn_id (once per environment)
 *   3. POST /api/Transactions/SubmitOrderRequest                -> redirect_url
 *   4. On IPN callback, GET /api/Transactions/GetTransactionStatus before marking paid.
 */
export const pesapal: PaymentProvider = {
  name: "pesapal",
  async createPayment() {
    throw new Error("Pesapal provider not implemented yet. See src/lib/payments/pesapal.ts");
  },
};
