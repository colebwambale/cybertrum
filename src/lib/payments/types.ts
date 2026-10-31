import type { Currency } from "../format";

export type PaymentMethod = "mobile_money" | "card" | "bank_transfer";

export interface CreatePaymentInput {
  reference: string; // our unique reference (payments.reference)
  amount: number;
  currency: Currency;
  method: Exclude<PaymentMethod, "bank_transfer">;
  customer: { email: string; name: string; phone?: string };
  redirectUrl: string; // where the provider sends the customer back
}

export interface PaymentProvider {
  name: string;
  /** Returns a hosted-checkout URL. Card details never touch our servers. */
  createPayment(input: CreatePaymentInput): Promise<{ redirectUrl: string }>;
}
