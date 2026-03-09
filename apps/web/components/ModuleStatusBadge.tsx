"use client";

export type Status = "live" | "partial" | "coming_soon";

interface ModuleStatusBadgeProps {
  status: Status;
  className?: string;
}

const labels: Record<Status, string> = {
  live: "Live",
  partial: "Partial",
  coming_soon: "Coming soon",
};

const styles: Record<Status, string> = {
  live: "bg-emerald-100 text-emerald-800 border-emerald-200",
  partial: "bg-amber-100 text-amber-800 border-amber-200",
  coming_soon: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function ModuleStatusBadge({ status, className = "" }: ModuleStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status]} ${className}`}
      title={
        status === "live"
          ? "Module is implemented with full flows."
          : status === "partial"
            ? "Some features are in place; others are planned."
            : "This module is a placeholder; full flows are planned."
      }
    >
      {labels[status]}
    </span>
  );
}
