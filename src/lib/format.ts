export type Currency = "UGX" | "USD";

/** Uganda VAT. Keep in one place so it is easy to change. */
export const VAT_RATE = 0.18;

export function formatMoney(amount: number, currency: Currency = "USD") {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "UGX" ? 0 : 2,
  }).format(amount);
}

export function calcTotals(subtotal: number, shipping = 0) {
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  return { subtotal, vat, shipping, total: Math.round((subtotal + vat + shipping) * 100) / 100 };
}
