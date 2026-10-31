/** Africa's Talking SMS. Phone numbers must be in international format, e.g. +256700000000. */
export async function sendSms(to: string, message: string) {
  const { AT_USERNAME, AT_API_KEY, AT_SENDER_ID } = process.env;
  if (!AT_USERNAME || !AT_API_KEY) return;
  const body = new URLSearchParams({ username: AT_USERNAME, to, message });
  if (AT_SENDER_ID) body.set("from", AT_SENDER_ID);
  await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: { apiKey: AT_API_KEY, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}
