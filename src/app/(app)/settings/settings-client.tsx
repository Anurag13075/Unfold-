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
  razorpayKeyId,
  hasWhatsapp,
  hasSms,
  hasEmail,
}: SettingsClientProps) {
  const [workspaceName, setWorkspaceName] = useState(initialName);

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
                <h2 className="font-display text-display-m text-text-primary">Razorpay connection</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pulse-500" />
                  <span className="font-mono text-mono-s text-pulse-700">Connected</span>
                </div>
              </div>
              <p className="font-mono text-mono-s text-text-secondary mb-4">
                {razorpayKeyId ? maskKeyId(razorpayKeyId) : "rzp_test_••••••••3f2a"}
              </p>
              <Button variant="ghost" size="sm">
                Rotate keys
              </Button>
            </Card>
          </div>

          <div className="col-span-12">
            <Card>
              <h2 className="font-display text-display-m text-text-primary mb-4">
                Notification channels
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
