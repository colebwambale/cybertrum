"use client";
import { useCart } from "./cart";
import type { Product } from "@/lib/mock-data";

export function AddToCart({ product, full }: { product: Product; full?: boolean }) {
  const { add } = useCart();
  return (
    <button
      className={`btn btn-primary ${full ? "w-full" : ""}`}
      onClick={() => add({ productId: product.id, slug: product.slug, name: product.name, sku: product.sku, price: product.price, currency: product.currency })}
    >
      Add to cart
    </button>
  );
}
