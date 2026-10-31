import { orders, products } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, PageHeader, StatCard } from "@/components/ui";

export default function AdminOverview() {
  // TODO: aggregate with SQL views/RPCs (revenue, orders, units, pending quotes) instead of mock numbers.
  const low = products.filter((p) => p.stock <= p.reorderLevel).length;
  return (
    <>
      <PageHeader title="Store overview" subtitle="Your operational pulse." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value="$112,480" note="↑ 12.8% vs previous period" />
        <StatCard label="Orders" value="148" note="↑ 8.0% vs previous period" />
        <StatCard label="Inventory units" value={String(products.reduce((n, p) => n + p.stock, 0))} note={`${low} SKUs below reorder level`} />
        <StatCard label="Pending quotations" value="7" note="$86,450 estimated pipeline" />
      </div>
      <h2 className="mb-3 mt-8 font-semibold">Recent orders</h2>
      <DataTable columns={["Order", "Customer", "Date", "Total", "Payment", "Fulfilment"]}
        rows={orders.map((o) => [o.number, o.customer, o.date, formatMoney(o.total, o.currency), <Badge key="p">{o.payment}</Badge>, <Badge key="s">{o.status}</Badge>])} />
      {low > 0 && <p className="mt-6 rounded-card bg-warn-soft p-4 text-sm text-warn">{low} products need restocking. Review reorder quantities in Inventory.</p>}
    </>
  );
}
