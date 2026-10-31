import Link from "next/link";
import { StoreHeader } from "@/components/store-header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10">{children}</main>
      <footer className="bg-navy px-4 py-10 text-sm text-white/70">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6">
          <p className="max-w-xs">Purpose-built technology for safer networks and smarter roads.</p>
          <nav className="flex gap-6"><Link href="/account/support">Technical support</Link><Link href="/account/quotes">Request a quote</Link></nav>
        </div>
      </footer>
    </>
  );
}
