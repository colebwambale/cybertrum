import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";
import { notifyUser } from "@/lib/push";
import { sendEmail } from "@/lib/email";
import { formatMoney, type Currency } from "@/lib/format";

/** Flutterwave webhook. Configure the URL + secret hash in the Flutterwave dashboard. */
export async function POST(req: Request) {
  if (req.headers.get("verif-hash") !== process.env.FLW_SECRET_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = await req.json();
  const txId = event?.data?.id;
  if (event?.event !== "charge.completed" || !txId) return NextResponse.json({ ok: true });

  const verified = await verifyFlutterwaveTransaction(txId);
  const db = createAdminClient();
  const { data: payment } = await db.from("payments").select("*").eq("reference", verified?.tx_ref ?? "").maybeSingle();
  if (!verified || !payment) return NextResponse.json({ ok: true });
  if (payment.status === "paid") return NextResponse.json({ ok: true }); // idempotent

  const matches =
    verified.status === "successful" && verified.currency === payment.currency && Number(verified.amount) >= Number(payment.amount);

  if (!matches) {
    await db.from("payments").update({ status: "failed", raw: verified }).eq("id", payment.id);
    return NextResponse.json({ ok: true });
  }

  await db.from("payments").update({ status: "paid", provider_txn_id: String(verified.id), raw: verified }).eq("id", payment.id);
  await db.rpc("mark_order_paid", { p_order_id: payment.order_id });

  const { data: order } = await db.from("orders").select("order_number,user_id,total,currency,delivery").eq("id", payment.order_id).single();
  if (order) {
    const total = formatMoney(Number(order.total), order.currency as Currency);
    await Promise.allSettled([
      notifyUser(order.user_id, { title: "Payment confirmed", body: `Order ${order.order_number} (${total}) is confirmed.`, url: "/account/orders" }),
      sendEmail(order.delivery.email, `Order ${order.order_number} confirmed`, `<p>Thanks for your order. We received ${total}.</p>`),
    ]);
  }
  return NextResponse.json({ ok: true });
}
