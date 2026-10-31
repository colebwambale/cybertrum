import { products } from "@/lib/mock-data";
import { Badge, DataTable, PageHeader } from "@/components/ui";

export default function Inventory() {
  return (
    <>
      <PageHeader title="Inventory" subtitle="Low-stock items should trigger a push notification to staff (see notifyStaff in src/lib/push.ts)." />
      <DataTable columns={["SKU", "Product", "On hand", "Reorder level", "Status"]}
        rows={products.map((p) => [p.sku, p.name, p.stock, p.reorderLevel, <Badge key="s">{p.stock <= p.reorderLevel ? "Low stock" : "In stock"}</Badge>])} />
    </>
  );
}
