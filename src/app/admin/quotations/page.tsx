import { quotes } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, PageHeader } from "@/components/ui";

export default function AdminQuotations() {
  return (
    <>
      <PageHeader title="Quotations" action={<button className="btn btn-primary">Issue quotation</button>} />
      <DataTable columns={["Quote", "Project", "Total", "Valid until", "Status"]}
        rows={quotes.map((q) => [q.number, q.title, formatMoney(q.total, q.currency), q.validUntil, <Badge key="s">{q.status}</Badge>])} />
    </>
  );
}
