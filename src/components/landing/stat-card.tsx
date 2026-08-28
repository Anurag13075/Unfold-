import { Card } from "@/components/ui/card";
import { CountUp } from "./count-up";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  accent?: string;
  note?: string;
  countUp?: boolean;
  endValue?: number;
}

export function StatCard({
  label,
  value,
  suffix = "",
  prefix = "",
  accent = "text-ember-500",
  note,
  countUp,
  endValue,
}: StatCardProps) {
  return (
    <Card>
      <p className="text-body-s uppercase tracking-wide text-text-secondary mb-2">{label}</p>
      <p className={cn("font-display text-display-xl tabular-nums", accent)}>
        {countUp && endValue !== undefined ? (
          <CountUp end={endValue} suffix={suffix} prefix={prefix} />
        ) : (
          <>
            {prefix}
            {value}
            {suffix}
          </>
        )}
      </p>
      {note && <p className="mt-2 text-body-m text-text-tertiary">{note}</p>}
    </Card>
  );
}
