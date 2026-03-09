"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModuleShell from "@/components/ModuleShell";
import * as api from "@/lib/api";

const TEMPLATES: { id: string; name: string; description: string; columns: string[] }[] = [
  {
    id: "ic-memo",
    name: "IC Memo Builder",
    description: "Generate committee-ready investment memo structures with citation slots.",
    columns: ["Key risks", "Valuation inputs", "Management themes"],
  },
  {
    id: "dd-risk",
    name: "DD Risk Sweep",
    description: "Scan uploaded diligence sources for risk themes and unresolved questions.",
    columns: ["Risk themes", "Unresolved questions", "Source reference"],
  },
  {
    id: "valuation",
    name: "Valuation Inputs Capture",
    description: "Extract assumptions, comps, and sensitivity anchors into structured fields.",
    columns: ["Assumptions", "Comps", "Sensitivity anchors"],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [using, setUsing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyTemplate = async (t: (typeof TEMPLATES)[0]) => {
    setUsing(t.id);
    setError(null);
    try {
      const ws = await api.createWorkspace(`${t.name} — New`);
      for (const col of t.columns) {
        await api.addField(ws.id, col);
      }
      router.push(`/workspace?workspace=${ws.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create workspace");
      setUsing(null);
    }
  };

  return (
    <ModuleShell
      title="Templates"
      subtitle="Prebuilt workflows for investment teams"
      action={{ label: "Open Workspace", href: "/workspace" }}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">{t.name}</h3>
            <p className="text-sm text-slate-600 mt-2">{t.description}</p>
            <p className="text-xs text-slate-500 mt-2">Columns: {t.columns.join(", ")}</p>
            <button
              onClick={() => applyTemplate(t)}
              disabled={using !== null}
              className="mt-4 px-3 py-2 rounded-lg text-sm bg-nautilus-accent text-white hover:bg-nautilus-accent-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {using === t.id ? "Creating…" : "Use template"}
            </button>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}
