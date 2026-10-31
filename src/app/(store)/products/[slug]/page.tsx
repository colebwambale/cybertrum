import { notFound } from "next/navigation";
import { products } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { Badge } from "@/components/ui";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug); // TODO: query Supabase by slug
  if (!p) notFound();

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="flex h-80 items-center justify-center rounded-card bg-line text-sm text-navy/40">Product gallery</div>
      <div>
        <p className="text-sm text-navy/50">{p.brand} · {p.sku}</p>
        <h1 className="mt-1 text-3xl font-light">{p.name}</h1>
        <p className="mt-2 text-navy/70">{p.summary}</p>
        <div className="mt-3 flex gap-2"><Badge>{p.stock > p.reorderLevel ? "In stock" : "Low stock"}</Badge></div>
        <p className="mt-6 text-3xl font-light">{formatMoney(p.price, p.currency)}</p>
        <p className="mt-1 text-xs text-navy/60">{p.warranty}. VAT added at checkout.</p>
        <div className="mt-6 max-w-xs"><AddToCart product={p} full /></div>
      </div>
    </div>
  );
}
