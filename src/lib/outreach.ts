import { createServiceClient } from "./supabase";

export interface OutreachResult {
  success: boolean;
  channel: "email" | "sms" | "whatsapp" | "telegram" | "webhook";
  provider: string;
  simulated: boolean;
  details?: string;
  error?: string;
}

export async function sendEmailOutreach(params: {
  to: string;
  subject: string;
  merchantName: string;
  amount: number;
  recoveryUrl: string;
  customApiKey?: string;
}): Promise<OutreachResult> {
  const apiKey = params.customApiKey || process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Undrop Recovery <onboarding@resend.dev>",
          to: [params.to],
          subject: params.subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #08090B; color: #ECE9E3; border-radius: 16px; border: 1px solid #23272E;">
              <div style="font-size: 12px; font-weight: 600; color: #F2A73B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                ${params.merchantName} · Payment Recovery Notice
              </div>
              <h1 style="font-size: 24px; font-weight: 700; color: #ECE9E3; margin-top: 0; margin-bottom: 16px;">
                Complete your payment of ₹${params.amount.toLocaleString("en-IN")}
              </h1>
              <p style="font-size: 14px; color: #9599A3; line-height: 1.6; margin-bottom: 24px;">
                We noticed your recent payment didn't go through due to a temporary bank issue. You can safely finish your transaction using our instant recovery checkout.
              </p>
              <a href="${params.recoveryUrl}" style="display: inline-block; background: #F2A73B; color: #08090B; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px;">
                Pay ₹${params.amount.toLocaleString("en-IN")} Now &rarr;
              </a>
              <p style="font-size: 12px; color: #5B6069; margin-top: 32px; border-top: 1px solid #23272E; padding-top: 16px;">
                Link: <a href="${params.recoveryUrl}" style="color: #F2A73B;">${params.recoveryUrl}</a>
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        return { success: true, channel: "email", provider: "resend", simulated: false, details: "Sent via Resend API" };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, channel: "email", provider: "resend", simulated: false, error: errJson.message || "Resend API error" };
    } catch (err: any) {
      return { success: false, channel: "email", provider: "resend", simulated: false, error: err.message };
    }
  }

  // Graceful simulation fallback
  return {
    success: true,
    channel: "email",
    provider: "resend (simulated)",
    simulated: true,
    details: `Simulated Email sent to ${params.to} with recovery link ${params.recoveryUrl}`,
  };
}

export async function sendSmsOutreach(params: {
  to: string;
  body: string;
  recoveryUrl: string;
  customSid?: string;
  customToken?: string;
  customFrom?: string;
}): Promise<OutreachResult> {
  const sid = params.customSid || process.env.TWILIO_ACCOUNT_SID;
  const token = params.customToken || process.env.TWILIO_AUTH_TOKEN;
  const from = params.customFrom || process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && from) {
    try {
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
          To: params.to,
          Body: fullBody,
        }),
      });

      if (res.ok) {
        return { success: true, channel: "sms", provider: "twilio", simulated: false, details: "Sent via Twilio API" };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, channel: "sms", provider: "twilio", simulated: false, error: errData.message || "Twilio error" };
    } catch (err: any) {
      return { success: false, channel: "sms", provider: "twilio", simulated: false, error: err.message };
    }
  }

  return {
    success: true,
    channel: "sms",
    provider: "twilio (simulated)",
    simulated: true,
    details: `Simulated SMS sent to ${params.to}: "${params.body}"`,
  };
}

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

export async function sendTelegramOutreach(params: {
  text: string;
  recoveryUrl: string;
  customBotToken?: string;
  customChatId?: string;
}): Promise<OutreachResult> {
  const botToken = params.customBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = params.customChatId || process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const messageText = `⚠️ <b>Undrop Payment Recovery Alert</b>\n\n${params.text}\n\n👉 <a href="${params.recoveryUrl}">Click here to retry & complete payment</a>`;
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      });

      if (res.ok) {
        return { success: true, channel: "telegram", provider: "telegram", simulated: false, details: "Sent via Telegram Bot API" };
      }
      return { success: false, channel: "telegram", provider: "telegram", simulated: false, error: "Telegram API failed" };
    } catch (err: any) {
      return { success: false, channel: "telegram", provider: "telegram", simulated: false, error: err.message };
    }
  }

  return {
    success: true,
    channel: "telegram",
    provider: "telegram (simulated)",
    simulated: true,
    details: `Simulated Telegram alert sent for ${params.recoveryUrl}`,
  };
}

export async function sendWebhookOutreach(params: {
  webhookUrl: string;
  payload: any;
}): Promise<OutreachResult> {
  try {
    const res = await fetch(params.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.payload),
    });

    if (res.ok) {
      return { success: true, channel: "webhook", provider: "webhook", simulated: false, details: `Webhook delivered to ${params.webhookUrl}` };
    }
    return { success: false, channel: "webhook", provider: "webhook", simulated: false, error: `HTTP ${res.status}` };
  } catch (err: any) {
    return { success: false, channel: "webhook", provider: "webhook", simulated: false, error: err.message };
  }
}
