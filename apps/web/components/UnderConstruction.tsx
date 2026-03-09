"use client";

import Link from "next/link";

const NAUTILUS_V1_DESCRIPTIONS: Record<string, string> = {
  "Whole Portfolio": "Single-pane-of-glass view of every Naira under management — positions, NAV, FX, and real-return analytics.",
  "Rebalancing": "Allocation vs target, rebalance trigger, and simulation. Mandate-aware drift detection.",
  "Analytics": "Attribution, risk (VaR, tracking error, factor exposure), and scenario analysis across funds.",
  "Market Intelligence": "Research console, AI summaries with citations, competitor monitoring, and regulatory tracker.",
  "Institution Hub": "Client segment, mandate adherence, one-click IC pack, and report generator.",
  "DocuFlow": "Intelligent document processing pipeline — ingest, classify, extract, and route.",
  "OMS": "AI-assisted order entry, execution strategy, and blotter. Integrated with pre-trade compliance.",
  "Valuation": "Valuation inputs capture, comps, sensitivity anchors, and committee-ready outputs.",
};

interface UnderConstructionProps {
  moduleName: string;
  /** Short Nautilus V1 description. Falls back to generic if not in the lookup. */
  description?: string;
}

export default function UnderConstruction({ moduleName, description }: UnderConstructionProps) {
  const desc = description ?? NAUTILUS_V1_DESCRIPTIONS[moduleName];

  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="max-w-sm w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        <p className="text-xs font-semibold text-nautilus-accent uppercase tracking-wider mb-2">Coming soon</p>
        <h2 className="font-semibold text-slate-900 text-lg">{moduleName}</h2>

        {desc && (
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/workspace"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm transition-colors"
          >
            Document Intelligence
          </Link>
        </div>
      </div>
    </div>
  );
}
