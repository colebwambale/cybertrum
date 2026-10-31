import Link from "next/link";

export default async function Confirmation({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  // TODO: look up the order + payment status and show Paid / Awaiting payment accordingly.
  return (
    <div className="card mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-light">Thanks, we have your order</h1>
      {order && <p className="mt-2 text-sm text-navy/70">Order {order}. We'll email you as soon as payment is confirmed.</p>}
      <Link href="/account/orders" className="btn btn-primary mt-6">View my orders</Link>
    </div>
  );
}
