"use client";

import Link from "next/link";
import ModuleStatusBadge from "./ModuleStatusBadge";

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
      <header className="shrink-0 border-b border-slate-100 bg-white px-6 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="font-semibold text-slate-900 text-sm tracking-tight truncate">{title}</h1>
          {status && <ModuleStatusBadge status={status} />}
          {subtitle && (
            <>
              <span className="text-slate-200">·</span>
              <p className="text-xs text-slate-400 truncate hidden sm:block">{subtitle}</p>
            </>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover transition-colors"
          >
            {action.label}
          </Link>
        )}
      </header>
      <main className="flex-1 overflow-auto p-6 min-h-0">{children}</main>
    </div>
  );
}
