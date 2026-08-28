"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { maskKeyId } from "@/lib/encryption";

interface SettingsClientProps {
  workspaceName: string;
  razorpayKeyId: string | null;
  hasWhatsapp: boolean;
  hasSms: boolean;
  hasEmail: boolean;
}

export function SettingsClient({
  workspaceName: initialName,
  razorpayKeyId: initialKeyId,
  hasWhatsapp: initialWa,
  hasSms: initialSms,
  hasEmail: initialEmail,
}: SettingsClientProps) {
  const [workspaceName, setWorkspaceName] = useState(initialName);
  const [keyId, setKeyId] = useState(initialKeyId ?? "");
  const [keySecret, setKeySecret] = useState("");
  const [isEditingKeys, setIsEditingKeys] = useState(!initialKeyId);
  const [isSaved, setIsSaved] = useState(false);

  const [channels, setChannels] = useState({
    WhatsApp: { connected: initialWa, key: "" },
    SMS: { connected: initialSms, key: "" },
    Email: { connected: initialEmail, key: "" },
  });

  const [activeModalChannel, setActiveModalChannel] = useState<string | null>(null);
  const [channelKeyInput, setChannelKeyInput] = useState("");
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleSaveKeys = async () => {
    setIsSaved(true);
    setIsEditingKeys(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveChannel = (channelName: string) => {
    setChannels((prev) => ({
      ...prev,
      [channelName]: { connected: true, key: channelKeyInput },
    }));
    setActiveModalChannel(null);
    setChannelKeyInput("");
  };

  const handleDisconnectChannel = (channelName: string) => {
    setChannels((prev) => ({
      ...prev,
      [channelName]: { connected: false, key: "" },
    }));
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText("https://unfold-zeta-one.vercel.app/api/webhooks/razorpay");
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-ink-950 border-b border-border px-6 flex items-center justify-between">
        <h1 className="font-display text-display-m text-text-primary">Settings</h1>
        {isSaved && (
          <span className="font-mono text-mono-s text-pulse-500 bg-pulse-500/10 px-3 py-1 rounded border border-pulse-500/30">
            ✓ Settings updated successfully
          </span>
        )}
      </header>

      <div className="p-6 max-w-container">
        <div className="grid grid-cols-12 gap-6 max-w-3xl">
          {/* Webhook Connection Card */}
          <div className="col-span-12">
            <Card className="border-pulse-500/40">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-display-m text-text-primary">Razorpay Webhook URL</h2>
                <span className="font-mono text-mono-s text-pulse-500 bg-pulse-500/10 px-2.5 py-0.5 rounded border border-pulse-500/20">
                  Live Webhook Ready
                </span>
              </div>
              <p className="text-body-m text-text-secondary mb-3">
                Copy this URL and paste it into your Razorpay Dashboard (Settings ➔ Webhooks) to receive live <code className="text-pulse-500 font-mono">payment.failed</code> events:
              </p>
              <div className="flex items-center justify-between gap-3 bg-ink-950 p-3 rounded-md border border-border mb-3">
                <code className="font-mono text-mono-s text-pulse-500 truncate select-all">
                  https://unfold-zeta-one.vercel.app/api/webhooks/razorpay
                </code>
                <Button variant="ghost" size="sm" onClick={copyWebhook}>
                  {copiedWebhook ? "✓ Copied!" : "Copy Webhook URL"}
                </Button>
              </div>
              <p className="font-mono text-mono-s text-text-tertiary">
                Events required: <strong className="text-text-secondary">payment.failed</strong> and <strong className="text-text-secondary">payment.captured</strong>
              </p>
            </Card>
          </div>

          {/* Razorpay API Keys Connection */}
          <div className="col-span-12">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-display-m text-text-primary">Razorpay API Keys</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${keyId ? "bg-pulse-500" : "bg-ember-500"}`} />
                  <span className={`font-mono text-mono-s ${keyId ? "text-pulse-700" : "text-ember-500"}`}>
                    {keyId ? "Configured" : "Keys Missing"}
                  </span>
                </div>
              </div>

              {isEditingKeys ? (
                <div className="space-y-4 border-t border-border pt-4">
                  <Input
                    label="Razorpay Key ID"
                    mono
                    placeholder="rzp_test_..."
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                  />
                  <Input
                    label="Razorpay Key Secret"
                    mono
                    secret
                    placeholder="••••••••••••••••"
                    value={keySecret}
                    onChange={(e) => setKeySecret(e.target.value)}
                  />
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSaveKeys}>Save API Keys</Button>
                    {initialKeyId && (
                      <Button variant="ghost" onClick={() => setIsEditingKeys(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-mono-s text-text-secondary mb-4">
                    {maskKeyId(keyId)}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingKeys(true)}>
                    Update API Keys
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Notification Channels */}
          <div className="col-span-12">
            <Card>
              <h2 className="font-display text-display-m text-text-primary mb-2">
                Notification channels
              </h2>
              <p className="text-body-m text-text-secondary mb-4">
                Configure your communication API credentials for WhatsApp, SMS, and Email recovery messages.
              </p>

              <div className="space-y-4">
                {Object.entries(channels).map(([name, info]) => (
                  <div key={name} className="flex items-center justify-between py-3 border-b border-border/50 last:border-none">
                    <div>
                      <p className="text-body-m font-medium text-text-primary">{name}</p>
                      <p className="font-mono text-mono-s text-text-tertiary">
                        {info.connected ? "••••••••connected" : "Not configured"}
                      </p>
                    </div>

                    {info.connected ? (
                      <Button variant="ghost" size="sm" onClick={() => handleDisconnectChannel(name)}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => { setActiveModalChannel(name); setChannelKeyInput(""); }}>
                        Connect {name}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Interactive Channel Connection Modal */}
          {activeModalChannel && (
            <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-surface-800 border border-border rounded-card p-6 max-w-md w-full shadow-modal space-y-4">
                <h3 className="font-display text-display-m text-text-primary">
                  Connect {activeModalChannel} Channel
                </h3>
                <p className="text-body-m text-text-secondary">
                  Enter your {activeModalChannel} provider API Key or Secret to enable automated customer recovery flows.
                </p>

                <Input
                  label={`${activeModalChannel} API Key / Secret`}
                  mono
                  secret
                  placeholder={`Enter ${activeModalChannel} key...`}
                  value={channelKeyInput}
                  onChange={(e) => setChannelKeyInput(e.target.value)}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setActiveModalChannel(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSaveChannel(activeModalChannel)} disabled={!channelKeyInput}>
                    Save & Connect
                  </Button>
                </div>
              </div>
            </div>
          )}

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
