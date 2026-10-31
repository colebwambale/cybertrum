import { quotes } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, PageHeader } from "@/components/ui";

export default function Quotes() {
  return (
    <>
      <PageHeader title="Quote requests" action={<button className="btn btn-primary">New quote request</button>} />
      <DataTable columns={["Quote", "Project", "Total", "Valid until", "Status"]}
        rows={quotes.map((q) => [q.number, q.title, formatMoney(q.total, q.currency), q.validUntil, <Badge key="s">{q.status}</Badge>])} />
    </>
  );
}
