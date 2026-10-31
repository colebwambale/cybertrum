import Link from "next/link";
import { products } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  // TODO: replace with supabase.from("products").select(...) filtered by category
  const list = category ? products.filter((p) => p.category === category) : products;

  return (
    <>
      <h1 className="max-w-2xl text-4xl font-light leading-tight">Equipment that protects. Expertise that delivers.</h1>
      <p className="mt-3 max-w-xl text-navy/70">Firewalls, intrusion prevention, and traffic signal control, specified and supported from order to deployment.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <article key={p.id} className="card flex flex-col p-4">
            <div className="mb-4 flex h-40 items-center justify-center rounded-control bg-line text-xs text-navy/40">Product image</div>
            <p className="text-xs text-navy/50">{p.brand}</p>
            <Link href={`/products/${p.slug}`} className="mt-1 font-semibold hover:text-brand">{p.name}</Link>
            <p className="mt-1 text-xs text-navy/60">{p.summary}</p>
            <p className="mt-1 text-xs text-ok">{p.stock} in stock · {p.warranty}</p>
            <p className="mt-3 text-xl font-light">{formatMoney(p.price, p.currency)}</p>
            <div className="mt-4"><AddToCart product={p} full /></div>
          </article>
        ))}
      </div>
    </>
  );
}
