import type { CreatePaymentInput, PaymentProvider } from "./types";

const BASE = "https://api.flutterwave.com/v3";
const headers = () => ({
  Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
  "Content-Type": "application/json",
});

export const flutterwave: PaymentProvider = {
  name: "flutterwave",
  async createPayment(input: CreatePaymentInput) {
    const res = await fetch(`${BASE}/payments`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amount,
        currency: input.currency,
        redirect_url: input.redirectUrl,
        payment_options: input.method === "mobile_money" ? "mobilemoneyuganda" : "card",
        customer: { email: input.customer.email, name: input.customer.name, phonenumber: input.customer.phone },
        customizations: { title: "Sentinel Supply" },
      }),
    });
    const json = await res.json();
    if (!res.ok || json.status !== "success") {
      throw new Error(`Flutterwave error: ${json.message ?? res.statusText}`);
    }
    return { redirectUrl: json.data.link as string };
  },
};

/** Always re-verify with the provider before marking an order paid: never trust the webhook body alone. */
export async function verifyFlutterwaveTransaction(transactionId: string | number) {
  const res = await fetch(`${BASE}/transactions/${transactionId}/verify`, { headers: headers() });
  const json = await res.json();
  return json.data as { status: string; tx_ref: string; amount: number; currency: string; id: number } | undefined;
}
