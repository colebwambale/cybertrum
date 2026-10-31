import webpush from "web-push";
import { createAdminClient } from "./supabase/admin";

let configured = false;
function configure() {
  if (configured) return true;
  const { NEXT_PUBLIC_VAPID_PUBLIC_KEY: pub, VAPID_PRIVATE_KEY: priv, VAPID_SUBJECT: subject } = process.env;
  if (!pub || !priv || !subject) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export type PushPayload = { title: string; body: string; url?: string };

/** Sends a push to every device a user has enabled. Dead subscriptions are removed. */
export async function notifyUser(userId: string, payload: PushPayload) {
  if (!configure()) return;
  const db = createAdminClient();
  const { data: subs } = await db.from("push_subscriptions").select("endpoint,p256dh,auth").eq("user_id", userId);
  await Promise.all(
    (subs ?? []).map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload),
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) await db.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      }
    }),
  );
}

/** Push to all staff, e.g. low-stock or new-quote alerts. */
export async function notifyStaff(payload: PushPayload) {
  const db = createAdminClient();
  const { data } = await db.from("profiles").select("id").in("role", ["staff", "admin", "super_admin"]);
  await Promise.all((data ?? []).map((p) => notifyUser(p.id, payload)));
}
