"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatCircleText, PaperPlaneTilt, Sparkle, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const starterQuestions = [
  "What is my recovery rate?",
  "Which route should I fix first?",
  "How much GMV is still at risk?",
];

export function CopilotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInsight, setHasInsight] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/copilot")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.insight) return;
        setMessages([{ role: "assistant", content: data.insight }]);
        setHasInsight(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const openPanel = () => {
    setOpen(true);
    setHasInsight(false);
  };

  const sendQuestion = async (questionOverride?: string) => {
    const question = (questionOverride ?? input).trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          conversationHistory: messages.slice(-10),
        }),
      });
      const data = await res.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: res.ok && data.answer ? data.answer : "I could not answer that from the current payment snapshot.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not reach Ask Undrop right now. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {!open && hasInsight && messages[0] && (
          <motion.button
            type="button"
            onClick={openPanel}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[320px] rounded-card border border-ember-500/40 bg-surface-800 p-3 text-left shadow-modal"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-ember-500/30 bg-ember-500/10 text-ember-500">
                <Sparkle size={16} weight="fill" />
              </span>
              <div>
                <p className="font-mono text-mono-s uppercase tracking-wide text-ember-500">
                  Ask Undrop noticed
                </p>
                <p className="mt-1 max-h-11 overflow-hidden text-body-m text-text-primary">{messages[0].content}</p>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-[560px] max-h-[calc(100vh-120px)] w-[min(calc(100vw-40px),420px)] flex-col overflow-hidden rounded-card border border-border bg-surface-800 shadow-modal"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-pulse-500/30 bg-pulse-500/10 text-pulse-500">
                  <ChatCircleText size={20} weight="fill" />
                </span>
                <div>
                  <h2 className="font-display text-display-m text-text-primary">Ask Undrop</h2>
                  <p className="text-body-s text-text-tertiary">Grounded in live merchant data</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-text-tertiary transition-colors hover:bg-white/[.055] hover:text-text-primary"
                aria-label="Close Ask Undrop"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="rounded-card border border-border bg-ink-950/45 p-4">
                  <p className="text-body-m text-text-primary">
                    Ask about recovery rate, at-risk GMV, route clusters, or agent decisions.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {starterQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => sendQuestion(question)}
                        className="rounded-chip border border-border bg-surface-700 px-3 py-1.5 text-body-s text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <MessageBubble key={`${message.role}-${index}`} message={message} />
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-card border border-border bg-surface-700 px-3 py-2">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              className="border-t border-border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                sendQuestion();
              }}
            >
              <div className="flex items-end gap-2 rounded-card border border-border bg-ink-950 p-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendQuestion();
                    }
                  }}
                  rows={1}
                  placeholder="Ask about your payment data..."
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-body-m text-text-primary outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-ember-500 text-ink-950 transition-colors hover:bg-ember-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send question"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={openPanel}
          className="relative flex h-14 min-h-14 w-14 min-w-14 items-center justify-center rounded-full border border-border-strong bg-ember-500 text-ink-950 shadow-modal transition-transform hover:-translate-y-0.5 hover:bg-ember-700"
          aria-label="Open Ask Undrop"
        >
          <ChatCircleText size={24} weight="fill" />
          {hasInsight && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-pulse-500 ring-2 ring-surface-800" />}
        </button>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-card px-3 py-2 text-body-m",
          isUser
            ? "bg-ember-500 text-ink-950"
            : "border border-border bg-surface-700 text-text-primary"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-text-tertiary"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.12 }}
        />
      ))}
    </div>
  );
}
