"use client";

import Link from "next/link";
import ModuleShell from "@/components/ModuleShell";

/** Nautilus V1 modules with one-liners (from Nautilus V1 white paper). */
const MODULES = [
  { id: "dashboard", name: "Dashboard", description: "Overview, quick actions, Pre-Trade Compliance kill-switch.", href: "/dashboard", status: "live" as const },
  { id: "workspace", name: "Document Intelligence", description: "Matrix over documents. Add documents, add column. Co-Pilot as Augmented Analyst.", href: "/workspace", status: "live" as const },
  { id: "reports", name: "Reports", description: "Templates, generation, export audit — institutional transparency and audit trails.", href: "/reports", status: "live" as const },
  { id: "portfolios", name: "Whole Portfolio Engine", description: "Single-pane-of-glass view of every Naira under management. Unifies IBOR and ABOR.", href: "/portfolios", status: "coming_soon" as const },
  { id: "copilot", name: "Nautilus Co-Pilot", description: "GenAI Augmented Analyst. Translates complex quant data into natural language.", href: "/workspace", status: "live" as const },
  { id: "personalization", name: "Personalization at Scale", description: "Automate construction and daily rebalancing of thousands of individual portfolios (55ip logic).", href: "/rebalancing", status: "coming_soon" as const },
  { id: "api", name: "API Storefront", description: "API-first platform. Fintechs, insurers, PFAs plug into Cordros regulated investment products.", href: "/developers", status: "partial" as const },
  { id: "shariah", name: "Shariah & ESG Guardrails", description: "Ethics middleware: scan assets for AAOIFI/ESG compliance. Zero-error Halal fund management.", href: "/settings", status: "coming_soon" as const },
  { id: "multicurrency", name: "Multi-Currency Real-Return Analytics", description: "NGN, USD, Gold-backed; devaluation-adjusted returns.", href: "#", status: "coming_soon" as const },
  { id: "compliance", name: "Pre-Trade Compliance Kill-Switch", description: "Hard-coded layer that blocks any trade exceeding SEC limits or fund mandate concentrations.", href: "/dashboard", status: "live" as const },
  { id: "institution", name: "Institutional Portal (B2B)", description: "Cloud-native window for PFAs: live performance, risk attribution, audit trails.", href: "/institution-hub", status: "coming_soon" as const },
  { id: "alternatives", name: "Alternative Asset Lifecycle", description: "J-curve of PE and infrastructure: capital calls to exit (eFront-style).", href: "#", status: "coming_soon" as const },
  { id: "oms", name: "Intelligent Order Management", description: "Aggregate orders across funds for institutional pricing. NGX and FMDQ.", href: "/oms", status: "coming_soon" as const },
  { id: "deal-sourcing", name: "Deal Sourcing", description: "AI-powered search, ranked targets, market multiples.", href: "/deal-sourcing", status: "partial" as const },
  { id: "market-intel", name: "Market Intelligence", description: "Research console, news + AI summaries, competitor monitoring.", href: "/market-intelligence", status: "coming_soon" as const },
  { id: "docuflow", name: "DocuFlow", description: "Templates, data mapping, AI writing assistant.", href: "/docuflow", status: "coming_soon" as const },
  { id: "valuation", name: "Valuation", description: "Deal, model inputs, comps, DCF, AI Co-Pilot.", href: "/valuation", status: "coming_soon" as const },
  { id: "regulator", name: "Regulator Reporting", description: "SEC/compliance templates, export history.", href: "/regulator-reporting", status: "partial" as const },
];

export default function PlatformPage() {
  return (
    <ModuleShell
      title="Platform"
      subtitle="Nautilus Wealth Operating System — module overview"
    >
      <div className="max-w-3xl space-y-4">
        <p className="text-sm text-slate-600">
          Central nervous system of Cordros Asset Management. From asset picker to platform provider.
        </p>
        <ul className="space-y-3">
          {MODULES.map((m) => (
            <li key={m.id}>
              <Link
                href={m.href}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-nautilus-accent hover:bg-nautilus-accent-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{m.name}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      m.status === "live"
                        ? "bg-emerald-100 text-emerald-800"
                        : m.status === "partial"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {m.status === "live" ? "Live" : m.status === "partial" ? "Partial" : "Coming soon"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{m.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ModuleShell>
  );
}
