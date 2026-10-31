import Link from "next/link";
import { orders, quotes } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, PageHeader, StatCard } from "@/components/ui";
import { PushToggle } from "@/components/push-toggle";

export default function AccountOverview() {
  // TODO: load the signed-in user's orders/quotes via the server Supabase client (RLS limits rows to this user).
  const q = quotes[0];
  return (
    <>
      <PageHeader title="Good morning" subtitle="Here's what's happening with your orders and projects." action={<PushToggle />} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value="12" />
        <StatCard label="Pending orders" value="1" note="Your latest order is being prepared" />
        <StatCard label="Quote requests" value="3" note="1 quote ready for your review" />
      </div>
      <h2 className="mb-3 mt-8 font-semibold">Recent orders</h2>
      <DataTable
        columns={["Order", "Date", "Total", "Status", ""]}
        rows={orders.map((o) => [o.number, o.date, formatMoney(o.total, o.currency), <Badge key="s">{o.status}</Badge>, <Link key="l" href="/account/orders" className="text-brand">View order</Link>])}
      />
      <div className="card mt-8 max-w-md">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Your active quotation</h2><Badge>{q.status}</Badge></div>
        <p className="mt-3 text-sm text-navy/60">{q.number} · valid until {q.validUntil}</p>
        <p className="mt-1 font-medium">{q.title}</p>
        <p className="mt-2 text-2xl font-light">{formatMoney(q.total, q.currency)}</p>
        <Link href="/account/quotes" className="btn mt-4">Review quotation</Link>
      </div>
    </>
  );
}
