import { decrypt } from "./encryption";
import type { DbUser } from "@/types";

// Decodes a merchant's saved, encrypted outreach credentials (see
// src/app/api/settings/outreach/route.ts for the exact stored shapes).
// Returns null per-channel when that channel isn't configured for this
// merchant, so callers can skip real sending rather than guessing at a
// fallback — auto-dispatch must never borrow another account's keys.

export interface TwilioChannelConfig {
  sid: string;
  token: string;
  from: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(decrypt(raw)) as T;
  } catch (err) {
    console.error("Failed to decrypt/parse outreach config:", err);
    return null;
  }
}

export function getMerchantEmailKey(user: DbUser): string | null {
  if (!user.email_key_enc) return null;
  try {
    return decrypt(user.email_key_enc);
  } catch (err) {
    console.error("Failed to decrypt email_key_enc:", err);
    return null;
  }
}

export function getMerchantSmsConfig(user: DbUser): TwilioChannelConfig | null {
  return safeParseJson<TwilioChannelConfig>(user.sms_key_enc);
}

export function getMerchantWhatsappConfig(user: DbUser): TwilioChannelConfig | null {
  return safeParseJson<TwilioChannelConfig>(user.whatsapp_key_enc);
}

export function getMerchantTelegramConfig(user: DbUser): TelegramConfig | null {
  return safeParseJson<TelegramConfig>(user.telegram_key_enc);
}
