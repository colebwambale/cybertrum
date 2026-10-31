import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payments";
import { calcTotals, type Currency } from "@/lib/format";

const Body = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), qty: z.number().int().min(1).max(999) })).min(1),
  delivery: z.object({
    fullName: z.string().min(2),
    company: z.string().optional(),
    email: z.string().email(),
    phone: z.string().min(9),
    address: z.string().min(3),
    city: z.string().min(2),
    district: z.string().optional(),
  }),
  method: z.enum(["mobile_money", "card", "bank_transfer"]),
});

export async function POST(req: Request) {
  if (!hasSupabaseEnv) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to place an order" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { items, delivery, method } = parsed.data;

  // Prices always come from the database, never from the browser.
  const db = createAdminClient();
  const { data: products } = await db
    .from("products").select("id,name,sku,price,currency").in("id", items.map((i) => i.productId)).eq("is_active", true);
  if (!products || products.length !== items.length) {
    return NextResponse.json({ error: "One or more products are unavailable" }, { status: 409 });
  }
  const currency = products[0].currency as Currency;
  if (products.some((p) => p.currency !== currency)) {
    return NextResponse.json({ error: "Mixed-currency carts are not supported" }, { status: 400 });
  }

  const lines = items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;
    return { product_id: p.id, name: p.name, sku: p.sku, unit_price: Number(p.price), qty: i.qty };
  });
  const totals = calcTotals(lines.reduce((s, l) => s + l.unit_price * l.qty, 0));

  const { data: order, error } = await db.from("orders").insert({
    user_id: user.id, currency, subtotal: totals.subtotal, vat: totals.vat, shipping: totals.shipping,
    total: totals.total, delivery, payment_method: method,
  }).select("id,order_number").single();
  if (error || !order) return NextResponse.json({ error: "Could not create order" }, { status: 500 });

  await db.from("order_items").insert(lines.map((l) => ({ ...l, order_id: order.id })));

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const confirmation = `${site}/checkout/confirmation?order=${order.order_number}`;

  if (method === "bank_transfer") {
    return NextResponse.json({ orderNumber: order.order_number, redirectUrl: confirmation });
  }

  const reference = `${order.order_number}-${Date.now()}`;
  const provider = getPaymentProvider();
  try {
    const { redirectUrl } = await provider.createPayment({
      reference, amount: totals.total, currency, method,
      customer: { email: delivery.email, name: delivery.fullName, phone: delivery.phone },
      redirectUrl: confirmation,
    });
    await db.from("payments").insert({
      order_id: order.id, provider: provider.name, reference, amount: totals.total, currency,
    });
    return NextResponse.json({ orderNumber: order.order_number, redirectUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment provider unavailable. Try again." }, { status: 502 });
  }
}
