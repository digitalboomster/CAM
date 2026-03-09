import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              N
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm">Nautilus</span>
              <span className="text-slate-400 text-[10px] block leading-none mt-0.5">Wealth Operating System</span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm transition-colors"
          >
            Enter platform →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto w-full">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Cordros Asset Management
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tight leading-[1.05] max-w-3xl text-slate-900">
            The{" "}
            <span className="text-teal-600">
              Aladdin of Africa
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-500 max-w-xl leading-relaxed">
            Institutional-grade Wealth Operating System for the Nigerian investment ecosystem.
          </p>

          <p className="mt-3 text-slate-400 max-w-lg text-sm leading-relaxed">
            Document Intelligence, Co-Pilot, pre-trade compliance, and full audit trails.<br />
            One platform for every Naira under management.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-md transition-colors"
            >
              Enter Nautilus
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/platform"
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              See all modules →
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-16 border-t border-slate-100 pt-8 w-full max-w-2xl">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <span>Total transparency</span>
              <span className="text-slate-200">·</span>
              <span>Enterprise security</span>
              <span className="text-slate-200">·</span>
              <span>Audit trail</span>
              <span className="text-slate-200">·</span>
              <span>NGX · FMDQ · SEC</span>
            </div>
          </div>

          {/* Value props */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {[
              {
                icon: "📄",
                label: "Document Intelligence",
                desc: "Extract, compare, and cite across any document — IC memos, DD, M&A, earnings.",
                href: "/workspace",
              },
              {
                icon: "🤖",
                label: "Augmented Analyst",
                desc: "Co-Pilot surfaces traceable, citation-backed answers from your source documents.",
                href: "/workspace",
              },
              {
                icon: "⚡",
                label: "Pre-Trade Compliance",
                desc: "Hard-coded kill-switch. Every trade checked against SEC limits and fund mandate.",
                href: "/oms",
              },
              {
                icon: "📊",
                label: "Analytics & Attribution",
                desc: "Performance attribution, risk metrics, VaR, tracking error, and Sharpe ratio.",
                href: "/analytics",
              },
              {
                icon: "⚖️",
                label: "Portfolio Rebalancing",
                desc: "Drift detection, simulation, and one-click order generation for mandate alignment.",
                href: "/rebalancing",
              },
              {
                icon: "🏛️",
                label: "Institution Hub",
                desc: "Client register, mandate adherence, and automated IC pack generation.",
                href: "/institution-hub",
              },
            ].map((v) => (
              <Link
                key={v.label}
                href={v.href}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-left hover:border-teal-300 hover:bg-teal-50/40 transition-colors group"
              >
                <span className="text-2xl mb-3 block">{v.icon}</span>
                <p className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">{v.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>Built for the Nigerian investment ecosystem.</span>
          <span>© Cordros Asset Management · Nautilus v1</span>
        </div>
      </footer>

    </div>
  );
}
