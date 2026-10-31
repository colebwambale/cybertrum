import { Sidebar } from "@/components/sidebar";

const items = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Order history" },
  { href: "/account/quotes", label: "Quote requests" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses & profile" },
  { href: "/account/support", label: "Support requests" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar heading="My account" items={items} footer={[{ href: "/", label: "Continue shopping" }]} />
      <main className="flex-1 p-5 lg:p-10">{children}</main>
    </div>
  );
}
