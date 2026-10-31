import { flutterwave } from "./flutterwave";
import { pesapal } from "./pesapal";
import type { PaymentProvider } from "./types";

export function getPaymentProvider(): PaymentProvider {
  return process.env.PAYMENT_PROVIDER === "pesapal" ? pesapal : flutterwave;
}
export * from "./types";
