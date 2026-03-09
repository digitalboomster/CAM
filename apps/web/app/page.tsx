import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-teal-400/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500 text-white font-bold text-base flex items-center justify-center tracking-tight shadow-lg shadow-teal-500/30">
              N
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight">Nautilus</span>
              <span className="text-slate-400 text-xs block leading-none mt-0.5">Wealth Operating System</span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-[0.15em] mb-6">
          Cordros Asset Management
        </p>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-3xl">
          The{" "}
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Aladdin of Africa
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
          Institutional-grade Wealth Operating System for the Nigerian investment ecosystem.
        </p>

        <p className="mt-4 text-slate-500 max-w-lg text-sm leading-relaxed">
          Document Intelligence, Co-Pilot, pre-trade compliance, and full audit trails.
          One platform for every Naira under management.
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Enter Nautilus
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/platform"
            className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 decoration-slate-600 hover:decoration-white"
          >
            See all modules
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-20 border-t border-white/10 pt-10 w-full max-w-2xl">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 uppercase tracking-wider font-medium">
            <span className="text-slate-400">Total transparency</span>
            <span className="text-slate-700">·</span>
            <span>Enterprise security</span>
            <span className="text-slate-700">·</span>
            <span>Audit trail</span>
            <span className="text-slate-700">·</span>
            <span>NGX / FMDQ / SEC</span>
          </div>
        </div>

        {/* Value props */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {[
            {
              label: "Document Intelligence",
              desc: "Extract, compare, and cite across any document — IC memos, DD, M&A, earnings.",
            },
            {
              label: "Augmented Analyst",
              desc: "Co-Pilot surfaces answers from your sources with traceable, citation-backed reasoning.",
            },
            {
              label: "Pre-Trade Compliance",
              desc: "Hard-coded kill-switch. Every trade checked against SEC limits and fund mandate.",
            },
          ].map((v) => (
            <div key={v.label} className="rounded-xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="text-sm font-semibold text-white mb-1">{v.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 py-5 text-center text-xs text-slate-600">
        Built for the Nigerian investment ecosystem. © Cordros Asset Management.
      </footer>
    </div>
  );
}
