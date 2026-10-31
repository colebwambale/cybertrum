import clsx from "clsx";

const BADGE: Record<string, string> = {
  Paid: "bg-ok-soft text-ok", Delivered: "bg-ok-soft text-ok", "In stock": "bg-ok-soft text-ok",
  Confirmed: "bg-brand-soft text-brand", Shipped: "bg-brand-soft text-brand", "Ready to review": "bg-brand-soft text-brand",
  Processing: "bg-warn-soft text-warn", "Low stock": "bg-warn-soft text-warn", Pending: "bg-warn-soft text-warn",
  Error: "bg-danger-soft text-danger", Cancelled: "bg-danger-soft text-danger",
};

export function Badge({ children }: { children: string }) {
  return <span className={clsx("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", BADGE[children] ?? "bg-line text-navy/70")}>{children}</span>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-light">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-navy/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-navy/60">{label}</p>
      <p className="mt-2 text-3xl font-light">{value}</p>
      {note && <p className="mt-1 text-xs text-navy/60">{note}</p>}
    </div>
  );
}

export function DataTable({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-canvas text-xs text-navy/60">
          <tr>{columns.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((cell, j) => <td key={j} className="px-4 py-4">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Stub({ title, note }: { title: string; note: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="card text-sm text-navy/70">{note}</div>
    </>
  );
}
