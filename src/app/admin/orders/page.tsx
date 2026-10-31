import { orders } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, PageHeader } from "@/components/ui";

export default function AdminOrders() {
  return (
    <>
      <PageHeader title="Orders" />
      <DataTable columns={["Order", "Customer", "Date", "Total", "Payment", "Fulfilment"]}
        rows={orders.map((o) => [o.number, o.customer, o.date, formatMoney(o.total, o.currency), <Badge key="p">{o.payment}</Badge>, <Badge key="s">{o.status}</Badge>])} />
    </>
  );
}
