"use client";
import { useState } from "react";
import { useCart } from "@/components/cart";
import { calcTotals, formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/ui";

const METHODS = [
  { id: "mobile_money", label: "Mobile Money (MTN / Airtel)" },
  { id: "card", label: "Credit / debit card" },
  { id: "bank_transfer", label: "Bank transfer" },
] as const;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("mobile_money");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const currency = lines[0]?.currency ?? "USD";
  const t = calcTotals(subtotal);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const res = await fetch("/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
        delivery: { fullName: f.fullName, company: f.company, email: f.email, phone: f.phone, address: f.address, city: f.city, district: f.district },
        method,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(typeof json.error === "string" ? json.error : "Check your details and try again.");
    clear();
    window.location.href = json.redirectUrl; // hosted payment page, or confirmation for bank transfer
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div><label className="label" htmlFor={name}>{label}</label><input id={name} name={name} className="input" {...props} /></div>
  );

  return (
    <>
      <PageHeader title="Checkout" subtitle="Secure checkout. Card and mobile money details are entered on our payment partner's page." />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card grid gap-4 sm:grid-cols-2">
            <h2 className="font-semibold sm:col-span-2">1. Delivery details</h2>
            {field("fullName", "Full name", { required: true })}
            {field("company", "Company")}
            {field("email", "Business email", { type: "email", required: true })}
            {field("phone", "Phone (+256…)", { type: "tel", required: true, placeholder: "+256 700 000000" })}
            <div className="sm:col-span-2">{field("address", "Street address", { required: true })}</div>
            {field("city", "Town / city", { required: true })}
            {field("district", "District")}
          </section>
          <section className="card">
            <h2 className="mb-4 font-semibold">2. Payment method</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {METHODS.map((m) => (
                <label key={m.id} className={`flex min-h-touch cursor-pointer items-center gap-2 rounded-control border px-3 text-sm ${method === m.id ? "border-brand bg-brand-soft" : "border-line"}`}>
                  <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} /> {m.label}
                </label>
              ))}
            </div>
            {method === "bank_transfer" && <p className="mt-3 text-sm text-navy/70">We'll email bank details and hold your order until payment clears.</p>}
          </section>
        </div>
        <aside className="card h-fit">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(t.subtotal, currency)}</dd></div>
            <div className="flex justify-between"><dt>VAT (18%)</dt><dd>{formatMoney(t.vat, currency)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatMoney(t.total, currency)}</dd></div>
          </dl>
          {error && <p role="alert" className="mt-4 rounded-control bg-danger-soft p-3 text-sm text-danger">{error}</p>}
          <button className="btn btn-primary mt-5 w-full" disabled={busy || lines.length === 0}>{busy ? "Placing order…" : `Place order · ${formatMoney(t.total, currency)}`}</button>
        </aside>
      </form>
    </>
  );
}
