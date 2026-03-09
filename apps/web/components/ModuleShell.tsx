"use client";

import Link from "next/link";
import ModuleStatusBadge, { type Status } from "./ModuleStatusBadge";

interface ModuleShellProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  status?: "live" | "partial" | "coming_soon";
  children: React.ReactNode;
}

export default function ModuleShell({ title, subtitle, action, status, children }: ModuleShellProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-white">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between gap-4 min-h-[56px]">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-semibold text-slate-900 text-[15px] leading-snug truncate">{title}</h1>
              {status && <ModuleStatusBadge status={status} />}
            </div>
            {subtitle ? <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p> : null}
          </div>
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm transition-colors"
          >
            {action.label}
          </Link>
        )}
      </header>
      <main className="flex-1 overflow-auto p-6 min-h-0 bg-slate-50">{children}</main>
    </div>
  );
}
