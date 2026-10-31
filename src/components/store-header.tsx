"use client";
import Link from "next/link";
import { ShieldCheck, ShoppingCart, User } from "lucide-react";
import { useCart } from "./cart";

export function StoreHeader() {
  const { count } = useCart();
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-medium"><ShieldCheck className="text-brand" /> Sentinel Supply</Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/?category=Cybersecurity" className="hidden sm:block">Cybersecurity</Link>
          <Link href="/?category=Traffic+management" className="hidden sm:block">Traffic management</Link>
          <Link href="/account" aria-label="My account"><User size={20} /></Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingCart size={20} />
            {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
