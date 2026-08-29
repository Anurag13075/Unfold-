"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { maskKeyId } from "@/lib/encryption";

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

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-ink-950 border-b border-border px-6 flex items-center">
        <h1 className="font-display text-display-m text-text-primary">Settings</h1>
      </header>

      <div className="p-6 max-w-container">
        <div className="grid grid-cols-12 gap-6 max-w-3xl">
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

          <div className="col-span-12">
            <Card>
              <h2 className="font-display text-display-m text-text-primary mb-4">
                Notification Channels
              </h2>
              <div className="space-y-4">
                <ChannelRow name="WhatsApp" connected={hasWhatsapp} />
                <ChannelRow name="SMS" connected={hasSms} />
                <ChannelRow name="Email" connected={hasEmail} />
              </div>
            </Card>
          </div>

          <div className="col-span-12">
            <Card>
              <h2 className="font-display text-display-m text-text-primary mb-4">Team</h2>
              <div className="flex gap-3 mb-4">
                <Input placeholder="Invite by email" className="flex-1" />
                <Button variant="ghost">Invite</Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-btn bg-surface-700 flex items-center justify-center text-body-s">
                  Y
                </div>
                <div>
                  <p className="text-body-m text-text-primary">You</p>
                  <span className="font-mono text-mono-s text-text-tertiary px-2 py-0.5 bg-surface-600 rounded-chip">
                    Owner
                  </span>
                </div>
              </div>
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
              <div className="mt-8 pt-6 border-t border-border">
                <button className="text-body-m text-flatline-500 hover:text-flatline-700 transition-colors">
                  Delete workspace
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function ChannelRow({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-body-m text-text-primary">{name}</p>
        <p className="font-mono text-mono-s text-text-tertiary">
          {connected ? "••••••••connected" : "Not configured"}
        </p>
      </div>
      <Button variant="ghost" size="sm">
        {connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
}
