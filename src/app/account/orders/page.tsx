import { orders } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, PageHeader } from "@/components/ui";

export default function Orders() {
  return (
    <>
      <PageHeader title="Order history" />
      <DataTable columns={["Order", "Date", "Total", "Payment", "Status"]}
        rows={orders.map((o) => [o.number, o.date, formatMoney(o.total, o.currency), <Badge key="p">{o.payment}</Badge>, <Badge key="s">{o.status}</Badge>])} />
    </>
  );
}
