export async function sendWhatsappOutreach(params: {
  to: string;
  body: string;
  recoveryUrl: string;
  customSid?: string;
  customToken?: string;
  customFrom?: string;
}): Promise<OutreachResult> {
  const sid = params.customSid || process.env.TWILIO_ACCOUNT_SID;
  const token = params.customToken || process.env.TWILIO_AUTH_TOKEN;
  // Twilio WhatsApp senders must be prefixed with "whatsapp:", e.g.
  // "whatsapp:+14155238886" for the Twilio sandbox number.
  const rawFrom = params.customFrom || process.env.TWILIO_WHATSAPP_FROM;

  if (sid && token && rawFrom) {
    try {
      const from = rawFrom.startsWith("whatsapp:") ? rawFrom : `whatsapp:${rawFrom}`;
      const to = params.to.startsWith("whatsapp:") ? params.to : `whatsapp:${params.to}`;
      const auth = Buffer.from(`${sid}:${token}`).toString("base64");
      const fullBody = `${params.body}\nComplete payment here: ${params.recoveryUrl}`;
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: from,
          To: to,
          Body: fullBody,
        }),
      });

      if (res.ok) {
        return { success: true, channel: "whatsapp", provider: "twilio", simulated: false, details: "Sent via Twilio WhatsApp API" };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, channel: "whatsapp", provider: "twilio", simulated: false, error: errData.message || "Twilio WhatsApp error" };
    } catch (err: any) {
      return { success: false, channel: "whatsapp", provider: "twilio", simulated: false, error: err.message };
    }
  }

  // Note: WhatsApp requires a dedicated Twilio WhatsApp-approved sender
  // (TWILIO_WHATSAPP_FROM), separate from a plain SMS number — an SMS-only
  // Twilio number cannot send WhatsApp messages. Without one, we simulate.
  return {
    success: true,
    channel: "whatsapp",
    provider: "twilio (simulated)",
    simulated: true,
    details: `Simulated WhatsApp sent to ${params.to}: "${params.body}"`,
  };
}
