import { cn } from "@/lib/utils";

type StatusVariant = "declined" | "recovering" | "recovered" | "failed" | "escalated" | "live" | "active" | "resolved";

const variants: Record<StatusVariant, { bg: string; text: string; label: string }> = {
  declined: { bg: "bg-flatline-wash", text: "text-flatline-700", label: "Declined" },
  recovering: { bg: "bg-ember-wash", text: "text-ember-700", label: "Recovering" },
  recovered: { bg: "bg-pulse-wash", text: "text-pulse-700", label: "Recovered" },
  failed: { bg: "bg-flatline-wash", text: "text-flatline-700", label: "Failed" },
  escalated: { bg: "bg-ember-wash", text: "text-ember-700", label: "Escalated" },
  live: { bg: "bg-pulse-wash", text: "text-pulse-700", label: "Live" },
  active: { bg: "bg-flatline-wash", text: "text-flatline-700", label: "Active" },
  resolved: { bg: "bg-pulse-wash", text: "text-pulse-700", label: "Resolved" },
};

interface StatusChipProps {
  status: StatusVariant;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const v = variants[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-chip font-mono text-mono-s",
        v.bg,
        v.text,
        className
      )}
    >
      {v.label}
    </span>
  );
}
