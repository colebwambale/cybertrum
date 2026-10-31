"use client";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/cart";
import { calcTotals, formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/ui";

export default function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  const currency = lines[0]?.currency ?? "USD";
  const t = calcTotals(subtotal);

  if (lines.length === 0) {
    return (
      <>
        <PageHeader title="Your cart" />
        <div className="card"><p className="text-sm text-navy/70">Your cart is empty.</p><Link href="/" className="btn btn-primary mt-4">Explore products</Link></div>
      </>
    );
  }
  return (
    <>
      <PageHeader title="Your cart" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {lines.map((l) => (
            <div key={l.productId} className="card flex items-center justify-between gap-4 p-4">
              <div><Link href={`/products/${l.slug}`} className="font-semibold">{l.name}</Link><p className="text-xs text-navy/60">{l.sku}</p></div>
              <div className="flex items-center gap-3">
                <input aria-label="Quantity" type="number" min={1} value={l.qty} onChange={(e) => setQty(l.productId, Number(e.target.value))} className="input w-20" />
                <p className="w-28 text-right">{formatMoney(l.price * l.qty, l.currency)}</p>
                <button aria-label={`Remove ${l.name}`} onClick={() => remove(l.productId)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <aside className="card h-fit">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(t.subtotal, currency)}</dd></div>
            <div className="flex justify-between"><dt>VAT (18%)</dt><dd>{formatMoney(t.vat, currency)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatMoney(t.total, currency)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn btn-primary mt-5 w-full">Continue to checkout</Link>
        </aside>
      </div>
    </>
  );
}
