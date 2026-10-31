import { products } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";
import { DataTable, PageHeader } from "@/components/ui";

export default function AdminProducts() {
  return (
    <>
      <PageHeader title="Products" action={<button className="btn btn-primary">Add product</button>} />
      <DataTable columns={["SKU", "Name", "Category", "Price"]}
        rows={products.map((p) => [p.sku, p.name, p.category, formatMoney(p.price, p.currency)])} />
    </>
  );
}
