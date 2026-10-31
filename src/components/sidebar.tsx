"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ShieldCheck, Menu } from "lucide-react";
import { useState } from "react";

export type NavItem = { href: string; label: string };

/** Persistent sidebar on desktop, collapsible drawer on mobile (matches the Figma responsive navigation). */
export function Sidebar({ heading, items, footer }: { heading: string; items: NavItem[]; footer?: NavItem[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === items[0].href ? path === href : path.startsWith(href));

  return (
    <>
      <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <button aria-label="Open menu" onClick={() => setOpen((o) => !o)}><Menu size={20} /></button>
        <span className="flex items-center gap-2 font-medium"><ShieldCheck className="text-brand" size={18} /> Sentinel Supply</span>
        <span className="w-5" />
      </header>
      <aside className={clsx("border-r border-line bg-white p-5 lg:block lg:w-60 lg:shrink-0", open ? "block" : "hidden")}>
        <Link href="/" className="mb-6 hidden items-center gap-2 text-lg font-medium lg:flex"><ShieldCheck className="text-brand" /> Sentinel Supply</Link>
        <p className="mb-3 text-xs font-medium text-navy/50">{heading}</p>
        <nav className="space-y-1">
          {items.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
              className={clsx("block rounded-control px-3 py-2 text-sm", active(i.href) ? "bg-brand-soft font-semibold text-brand" : "text-navy/70 hover:bg-canvas")}>
              {i.label}
            </Link>
          ))}
        </nav>
        {footer && (
          <nav className="mt-10 space-y-1 border-t border-line pt-4">
            {footer.map((i) => <Link key={i.href} href={i.href} className="block px-3 py-1.5 text-sm text-navy/60 hover:text-navy">{i.label}</Link>)}
          </nav>
        )}
      </aside>
    </>
  );
}
