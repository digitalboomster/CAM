"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ModuleShell from "@/components/ModuleShell";
import { loadSettings, saveSettings, applyTheme, type AppSettings, type DefaultExportFormat, type Theme } from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const handleSave = () => {
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleTheme = () => {
    if (!settings) return;
    const next: Theme = settings.theme === "dark" ? "light" : "dark";
    const updated = { ...settings, theme: next };
    setSettings(updated);
    saveSettings(updated);
  };

  if (settings === null) {
    return (
      <ModuleShell title="Settings" subtitle="Workspace, export, and compliance preferences">
        <p className="text-slate-500">Loading…</p>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell title="Settings" subtitle="Workspace, export, and compliance preferences — Shariah & ESG guardrails (see Nautilus modules)">
      <div className="max-w-xl rounded-xl border border-slate-100 bg-white p-5 space-y-4">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Dark mode</p>
            <p className="text-xs text-slate-500">Switch between light and dark interface.</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={settings.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
              settings.theme === "dark" ? "bg-teal-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                settings.theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* Default export format */}
        <div>
          <p className="text-sm font-medium text-slate-800">Default export format</p>
          <p className="text-xs text-slate-500 mb-2">Choose how reports are shared with committee members.</p>
          <select
            value={settings.defaultExportFormat}
            onChange={(e) => setSettings((s) => s ? { ...s, defaultExportFormat: e.target.value as DefaultExportFormat } : s)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="pdf">PDF with citations</option>
            <option value="excel">Excel + source index</option>
          </select>
        </div>

        {/* Require citations */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Require citations on exports</p>
            <p className="text-xs text-slate-500">Warn or block export if unresolved cells are uncited.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireCitationsOnExport}
            onChange={(e) => setSettings((s) => s ? { ...s, requireCitationsOnExport: e.target.checked } : s)}
            className="rounded border-slate-300 text-teal-600"
          />
        </div>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-lg text-sm bg-teal-600 text-white hover:bg-teal-700"
          >
            Save settings
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved.</span>}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-800">Shariah & ESG guardrails</p>
          <p className="text-xs text-slate-500 mt-1">
            Ethics middleware that scans all underlying assets for AAOIFI (Shariah) or ESG mandate compliance. Zero-error Halal fund management and real-time ethical auditing.
          </p>
          <Link
            href="/shariah-esg"
            className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors"
          >
            Open Shariah & ESG
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </ModuleShell>
  );
}
