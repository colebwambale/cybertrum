import { Sidebar } from "@/components/sidebar";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/quotations", label: "Quotations" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/reports", label: "Reports & analytics" },
  { href: "/admin/settings", label: "Team & settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar heading="Store administration" items={items} footer={[{ href: "/", label: "View storefront" }]} />
      <main className="flex-1 p-5 lg:p-10">{children}</main>
    </div>
  );
}
