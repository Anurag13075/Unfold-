"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlaneTilt, CheckCircle, Spinner, WarningCircle } from "@phosphor-icons/react";

interface SettingsClientProps {
  userId: string;
  workspaceName: string;
  razorpayKeyId: string | null;
  hasWebhookSecret: boolean;
  hasWhatsapp: boolean;
  hasSms: boolean;
  hasEmail: boolean;
}

export function SettingsClient({
  userId,
  workspaceName: initialName,
  razorpayKeyId,
  hasWebhookSecret: initialHasWebhookSecret,
  hasWhatsapp,
  hasSms,
  hasEmail,
}: SettingsClientProps) {
  const [workspaceName, setWorkspaceName] = useState(initialName);
  const [keyId, setKeyId] = useState(razorpayKeyId || "");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [hasWebhookSecret, setHasWebhookSecret] = useState(initialHasWebhookSecret);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hostOrigin, setHostOrigin] = useState("");

  // Outreach testing state
  const [testChannel, setTestChannel] = useState<"email" | "sms" | "telegram" | "webhook">("email");
  const [testRecipient, setTestRecipient] = useState("");
  const [customResendKey, setCustomResendKey] = useState("");
  const [customTwilioSid, setCustomTwilioSid] = useState("");
  const [customTwilioToken, setCustomTwilioToken] = useState("");
  const [customTwilioFrom, setCustomTwilioFrom] = useState("");
  const [customTelegramToken, setCustomTelegramToken] = useState("");
  const [customTelegramChat, setCustomTelegramChat] = useState("");
  const [testingOutreach, setTestingOutreach] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostOrigin(window.location.origin);
    }
  }, []);

  const webhookUrl = `${hostOrigin || "https://your-domain.com"}/api/webhooks/razorpay/${userId}`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_key_id: keyId,
          ...(webhookSecret ? { razorpay_webhook_secret: webhookSecret } : {}),
        }),
      });

      if (res.ok) {
        setMessage("Razorpay settings saved successfully!");
        if (webhookSecret) {
          setHasWebhookSecret(true);
          setWebhookSecret("");
        }
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error || "Failed to save settings"}`);
      }
    } catch (err) {
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestOutreach = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingOutreach(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/recovery/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: testChannel,
          recipient: testRecipient,
          customKeys: {
            resendApiKey: customResendKey,
            twilioSid: customTwilioSid,
            twilioToken: customTwilioToken,
            twilioFrom: customTwilioFrom,
            telegramBotToken: customTelegramToken,
            telegramChatId: customTelegramChat,
            webhookUrl: testRecipient,
          },
        }),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message || "Failed to trigger test" });
    } finally {
      setTestingOutreach(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-ink-950 border-b border-border px-6 flex items-center">
        <h1 className="font-display text-display-m text-text-primary">Settings</h1>
      </header>

      <div className="p-6 max-w-container">
        <div className="grid grid-cols-12 gap-6 max-w-3xl">
          {/* Razorpay Connection */}
          <div className="col-span-12">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-display-m text-text-primary">Razorpay Connection</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasWebhookSecret ? "bg-pulse-500" : "bg-flatline-500"
                    }`}
                  />
                  <span
                    className={`font-mono text-mono-s ${
                      hasWebhookSecret ? "text-pulse-700" : "text-flatline-500"
                    }`}
                  >
                    {hasWebhookSecret ? "Connected & Verified" : "Secret Not Configured"}
                  </span>
                </div>
              </div>

              {/* Webhook URL display */}
              <div className="mb-6 p-3 bg-surface-900 border border-border rounded-md">
                <label className="block font-mono text-mono-s text-text-tertiary mb-1">
                  Your Unique Per-Merchant Webhook URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 bg-transparent font-mono text-mono-s text-text-primary focus:outline-none select-all"
                  />
                  <Button variant="ghost" size="sm" onClick={handleCopyWebhook}>
                    {copied ? "Copied!" : "Copy URL"}
                  </Button>
                </div>
              </div>

              <div className="p-3 mb-6 bg-surface-900/50 border border-ember-500/20 rounded-md text-body-s text-text-secondary">
                <strong className="text-ember-500">Setup Order:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Enter and save your <strong>Webhook Secret</strong> below first.</li>
                  <li>Copy your unique <strong>Webhook URL</strong> above and add it to your Razorpay Dashboard webhooks.</li>
                </ol>
              </div>

              <form onSubmit={handleSaveRazorpay} className="space-y-4">
                <Input
                  label="Razorpay Key ID"
                  mono
                  placeholder="rzp_test_..."
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                />

                <div>
                  <Input
                    label="Razorpay Webhook Secret"
                    mono
                    secret
                    placeholder={hasWebhookSecret ? "•••••••• (Secret set — leave blank to keep unchanged)" : "Enter webhook secret"}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                  />
                  <p className="font-mono text-mono-s text-text-tertiary mt-1">
                    Used to cryptographically verify incoming payment failure events.
                  </p>
                </div>

                {message && (
                  <p
                    className={`text-body-s ${
                      message.startsWith("Error") ? "text-flatline-500" : "text-pulse-700"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Razorpay Credentials"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Real Multi-Channel Outreach Dispatch Tester */}
          <div className="col-span-12">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-display-m text-text-primary">
                  Multi-Channel Recovery Outreach
                </h2>
                <span className="font-mono text-mono-s px-2.5 py-1 rounded-full bg-ember-wash text-ember-500 border border-ember-500/30">
                  Live Dispatch Tester
                </span>
              </div>

              <p className="text-body-s text-text-secondary mb-6">
                Test sending real recovery messages over Email (Resend), SMS/WhatsApp (Twilio), Telegram, or custom Webhooks. If custom API keys are empty, Undrop gracefully simulates the dispatch.
              </p>

              <form onSubmit={handleTestOutreach} className="space-y-4">
                <div className="grid grid-cols-4 gap-2 p-1 bg-surface-900 rounded-lg border border-border">
                  {(["email", "sms", "telegram", "webhook"] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setTestChannel(ch)}
                      className={`py-1.5 text-mono-s font-mono rounded-md uppercase transition ${
                        testChannel === ch
                          ? "bg-surface-700 text-ember-500 shadow-sm font-semibold"
                          : "text-text-tertiary hover:text-text-primary"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>

                {testChannel === "email" && (
                  <div className="space-y-3">
                    <Input
                      label="Recipient Email Address"
                      placeholder="e.g. merchant@example.com"
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                    />
                    <Input
                      label="Custom Resend API Key (Optional)"
                      mono
                      secret
                      placeholder="re_123456789... (Leave empty to use env / simulation)"
                      value={customResendKey}
                      onChange={(e) => setCustomResendKey(e.target.value)}
                    />
                  </div>
                )}

                {testChannel === "sms" && (
                  <div className="space-y-3">
                    <Input
                      label="Recipient Phone Number (E.164 format)"
                      placeholder="e.g. +919876543210"
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Twilio Account SID (Optional)"
                        mono
                        placeholder="AC..."
                        value={customTwilioSid}
                        onChange={(e) => setCustomTwilioSid(e.target.value)}
                      />
                      <Input
                        label="Twilio Auth Token (Optional)"
                        mono
                        secret
                        placeholder="••••••••"
                        value={customTwilioToken}
                        onChange={(e) => setCustomTwilioToken(e.target.value)}
                      />
                    </div>
                    <Input
                      label="Twilio Phone Number (Optional)"
                      mono
                      placeholder="+1234567890"
                      value={customTwilioFrom}
                      onChange={(e) => setCustomTwilioFrom(e.target.value)}
                    />
                  </div>
                )}

                {testChannel === "telegram" && (
                  <div className="space-y-3">
                    <Input
                      label="Telegram Bot Token (Optional)"
                      mono
                      secret
                      placeholder="123456789:ABCdef..."
                      value={customTelegramToken}
                      onChange={(e) => setCustomTelegramToken(e.target.value)}
                    />
                    <Input
                      label="Telegram Chat ID (Optional)"
                      mono
                      placeholder="-100123456789 or @channel"
                      value={customTelegramChat}
                      onChange={(e) => setCustomTelegramChat(e.target.value)}
                    />
                  </div>
                )}

                {testChannel === "webhook" && (
                  <div className="space-y-3">
                    <Input
                      label="Custom Target Webhook URL"
                      placeholder="https://example.com/api/outreach-webhook"
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" disabled={testingOutreach} className="w-full justify-center">
                    {testingOutreach ? (
                      <>
                        <Spinner className="w-4 h-4 animate-spin mr-2" /> Dispatching Test...
                      </>
                    ) : (
                      <>
                        <PaperPlaneTilt size={16} className="mr-2" /> Dispatch Test {testChannel.toUpperCase()} Recovery
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {testResult && (
                <div className="mt-4 p-4 bg-surface-900 border border-border rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-mono text-mono-s">
                    {testResult.result?.success ? (
                      <span className="text-pulse-700 flex items-center gap-1">
                        <CheckCircle size={16} /> Dispatched Successfully ({testResult.result?.provider})
                      </span>
                    ) : (
                      <span className="text-flatline-500 flex items-center gap-1">
                        <WarningCircle size={16} /> Dispatch Issue: {testResult.error || testResult.result?.error}
                      </span>
                    )}
                  </div>
                  {testResult.result?.details && (
                    <p className="font-mono text-mono-s text-text-secondary">{testResult.result.details}</p>
                  )}
                  {testResult.recoveryUrl && (
                    <p className="font-mono text-mono-s text-ember-500">
                      Generated Recovery Link:{" "}
                      <a href={testResult.recoveryUrl} target="_blank" rel="noreferrer" className="underline">
                        {testResult.recoveryUrl}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="col-span-12">
            <Card>
              <h2 className="font-display text-display-m text-text-primary mb-4">Workspace</h2>
              <Input
                label="Workspace name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
