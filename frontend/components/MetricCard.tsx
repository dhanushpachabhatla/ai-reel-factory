import { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-line glass p-5 shadow-sm card-hover">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-white shadow-sm">
          <Icon size={18} />
        </div>
        <p className="text-sm font-bold text-ink">{label}</p>
      </div>
      <p className="mt-4 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </div>
  );
}
