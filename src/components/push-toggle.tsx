"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

/** Opt-in button. Ask only after a user action: browsers penalise unsolicited permission prompts. */
export function PushToggle() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ok = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(ok);
    if (ok) navigator.serviceWorker.ready.then((r) => r.pushManager.getSubscription()).then((s) => setEnabled(Boolean(s)));
  }, []);

  if (!supported) return null;

  async function toggle() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        await fetch("/api/push/subscribe", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: existing.endpoint }) });
        await existing.unsubscribe();
        setEnabled(false);
        return;
      }
      if ((await Notification.requestPermission()) !== "granted") return;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      const res = await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sub) });
      setEnabled(res.ok);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={toggle} disabled={busy} className="btn btn-sm gap-2">
      {enabled ? <BellOff size={14} /> : <Bell size={14} />}
      {enabled ? "Turn off notifications" : "Get order notifications"}
    </button>
  );
}
