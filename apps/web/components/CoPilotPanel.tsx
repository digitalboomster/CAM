"use client";

import { useState, useEffect, useRef } from "react";
import { CO_PILOT_STEPS } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  steps?: string[];
}

interface CoPilotPanelProps {
  onClose: () => void;
  onOpenExportLog?: () => void;
  initialQuery?: string;
}

// ── Response library ────────────────────────────────────────────────────────

const RESPONSES: { match: string[]; title: string; answer: string[] }[] = [
  {
    match: ["ic memo", "investment committee", "committee memo", "committee-ready"],
    title: "IC Memo — Project Alpha",
    answer: [
      "**Investment Recommendation: Project Alpha (Selective Acquire)**",
      "Company operates in the tech-enabled industrial services sector in West Africa with NGN115bn revenue, 24% EBITDA margin, and 68% recurring revenue. Three-year CAGR 21%.",
      "**Valuation:** Management asking price implies 12.8× EV/EBITDA. Comparable transactions (TechBridge 12.8×, Instore Africa 11.2×) support the range. Our DCF midpoint NGN1,335bn equity value at 18% WACC.",
      "**Key risks to disclose:** (1) Customer concentration — top 2 clients = 41% revenue; (2) Ogun plant land dispute unresolved; (3) NGN1.2bn tax contingency with FIRS; (4) Kenya investment licence pending.",
      "**Recommendation:** Proceed to exclusivity subject to resolution of Kenya licence and FIRS quantification. Propose earn-out structure (2-year, 15% of equity consideration) to align management post-close.",
      "Sources: Project Alpha CIM v3 (§6, §8), Legal DD Summary (p.7, p.10), Management Accounts Dec 2025 (p.2), Precedent Transactions Analysis (p.9).",
    ],
  },
  {
    match: ["due diligence", "dd question", "key dd", "diligence"],
    title: "Key DD Questions — Project Alpha",
    answer: [
      "Based on analysis of 7 source documents, the following due diligence questions are prioritised for the management meeting:",
      "**1. Customer concentration** — Top-2 clients are 41% of revenue (CIM §8). What is the contractual term remaining on each? Are they renewing, and on what commercial terms?",
      "**2. EBITDA margin compression** — December 2025 EBITDA margin fell to 22.1% from 26.3% in Q3 (Board Deck Q4 2025). Is this structural or one-off? What is the LPG conversion programme timeline?",
      "**3. Kenya licence** — Investment licence application was pending as of Jan 2026 filing date. What is the current status? Does closing require it to be in hand?",
      "**4. FIRS tax dispute (NGN1.2bn)** — What is the timeline for resolution? Has a settlement offer been made? Is the NGN1.2bn a worst case or most likely outcome?",
      "**5. Apex Industries receivable (NGN480m)** — What is the recovery prospect? Is this a credit loss or a timing item?",
      "**6. Working capital deterioration** — WC cycle elongated from 62 to 84 days (Board Deck). What is driving this and what is the remediation plan?",
      "Sources: CIM v3 (§8), Board Deck Q4 2025 (slides 7, 14), Legal DD (p.7, p.10), Management Accounts Dec 2025 (p.3, p.4).",
    ],
  },
  {
    match: ["m&a", "deal point", "provision", "merger", "acquisition"],
    title: "M&A Key Points — Project Alpha",
    answer: [
      "**Transaction structure recommendations based on document analysis:**",
      "**Price:** Management asking price 12.8× EV/EBITDA. Comparable deals (median 11.4×, 75th pct 13.0×) suggest negotiating room. Proposed entry: 11.8–12.2× subject to working capital adjustment.",
      "**Earn-out:** Precedent transactions analysis (p.11) shows earn-out deals outperformed on 3Y basis. Recommend 15% of equity consideration tied to FY2026–FY2027 EBITDA targets.",
      "**Management retention:** 6 of 8 precedent deals included retention packages 2–3% of deal value. Founder-CEO is key person risk — propose 3-year retention with 12-month non-compete.",
      "**Conditions precedent:** (1) Kenya investment licence; (2) FIRS settlement agreed and quantified; (3) Ogun land dispute resolution (or escrow for NGN320m claim + NGN640m title risk); (4) FCCPC merger notification clearance (est. 4.2 months).",
      "**Working capital peg:** peg at NGN-18.5bn (normalised, excluding Apex NGN480m provision and seasonal December variance).",
      "Sources: CIM v3 (§6, §9), Legal DD (p.4, p.7, p.10, p.13), Precedent Transactions (p.5, p.8, p.11, p.13).",
    ],
  },
  {
    match: ["risk", "risks", "red flag", "concern"],
    title: "Risk Analysis — Project Alpha & Dangote Cement",
    answer: [
      "**Risks identified across all 7 source documents (ranked by materiality):**",
      "**High:** Customer concentration — Project Alpha top-2 clients = 41% revenue (CIM §8). Single-client receivable provision NGN480m suggests credit risk (Mgmt Accounts Dec 2025).",
      "**High:** Tax contingency NGN1.2bn (Dangote FY2025 Annual Report p.38; Legal DD p.10). FIRS dispute unresolved. Timing and quantum uncertain.",
      "**Medium:** Ogun plant land dispute — 4.2 hectares in dispute with Ogun State Government. Contractor claim NGN320m in arbitration (Legal DD p.7).",
      "**Medium:** Kenya investment licence pending — could delay East Africa expansion timeline by 6–12 months (CIM v3 §9).",
      "**Medium:** EBITDA margin compression — Q4 2025 margin 22.1% vs 26.3% in Q3. Energy cost spike NGN640m not fully explained by LPG conversion timeline (Board Deck Q4 2025).",
      "**Low:** Sector overcapacity risk if 8 announced cement plants commissioned 2026–2028 (SABB-CM Sector Research p.12).",
      "Sources: CIM v3, Legal DD, Management Accounts Dec 2025, Board Deck Q4 2025, Dangote FY2025 Annual Report, SABB-CM Sector Research.",
    ],
  },
  {
    match: ["valuation", "dcf", "multiple", "ev/ebitda", "price", "worth"],
    title: "Valuation Summary",
    answer: [
      "**Valuation analysis based on source documents:**",
      "**DCF:** At 18% WACC and 5% terminal growth, equity value range NGN1,180bn–NGN1,490bn. Midpoint NGN1,335bn. Implied EV/EBITDA 10.8×.",
      "**Trading comps:** Dangote Cement 11.0×, BUA Cement 10.6×, Lafarge Africa 10.3×. Sector median 10.6× (SABB-CM Sector Research p.18).",
      "**Precedent transactions:** 8 West African industrial deals 2020–2025 at 8.5–14.2×, median 11.4×. Tech-enabled premium +1.8× vs traditional industrials (Precedent Transactions p.8).",
      "**Project Alpha asking price:** 12.8× EV/EBITDA on LTM EBITDA NGN28.4bn → implied EV NGN364bn, equity value NGN346bn (net of NGN18.2bn net debt). Supported by comparable TechBridge deal (12.8×) but above sector median.",
      "**Recommendation:** Negotiate to 11.8–12.2× with earn-out structure bridging gap. Represents NGN14–24bn reduction in upfront consideration.",
    ],
  },
  {
    match: ["research", "synthesis", "sector", "market", "cement", "industry"],
    title: "Research Synthesis — Nigerian Cement Sector",
    answer: [
      "**Key findings from SABB-CM Sector Research (Feb 2026):**",
      "Total sector revenue NGN2.1tn in 2025 (+16% YoY). Dangote 47% market share, BUA Cement 28%, Lafarge Africa 12%.",
      "**Demand drivers:** Federal Government road programme (22,000km) + housing scheme (500,000 units) underpins 8–10% pa demand growth to 2028. Urbanisation rate 5.2% pa provides structural tailwind.",
      "**Risks:** FX exposure on imported clinker (35–40% COGS). Overcapacity risk if all 8 announced plants commissioned 2026–2028. Infrastructure spend linked to oil price via federation account.",
      "**Top picks:** DANGCEM Buy, 12m TP NGN420 (+24% upside). BUACEMENT Hold, TP NGN395 (+4% upside).",
      "**Regional context:** Nigerian cement trades at premium to regional peers (9.8× Kenya, 8.7× South Africa) on liquidity and scale. Pan-African expansion a key differentiator for Dangote.",
      "Source: Nigerian Cement Sector Research — SABB-CM, Feb 2026.",
    ],
  },
  {
    match: ["comps", "comparable", "earnings", "analysis", "financials", "revenue"],
    title: "Financial Analysis — All Sources",
    answer: [
      "**Financial summary compiled from source documents:**",
      "**Dangote Cement FY2025:** Revenue NGN1,240bn (+14%), EBITDA NGN310bn (25% margin), net debt NGN142bn (0.46× ND/EBITDA), FCF yield 6.8%.",
      "**Project Alpha LTM Dec 2025:** Revenue NGN115.2bn (+17% YoY). EBITDA NGN28.4bn (24.7% margin). Net debt NGN18.2bn (0.64×). Gross margin 42.3% (above sector median 36%).",
      "**Trajectory concern:** December EBITDA margin 22.1% vs Q3 26.3%. Year-end one-offs total ~NGN1.1bn. LTM margin of 24.7% may overstate run-rate if energy savings don't materialise in Q2 2026.",
      "**Budget FY2026:** Revenue NGN135bn (+17%). CapEx NGN8.2bn. NGN3bn buyback approved. Budget implies stable margins — assumes LPG conversion savings.",
      "Sources: FY2025 Annual Report (p.11–12), Management Accounts Dec 2025 (p.2–4), Board Deck Q4 2025 (slides 7–8).",
    ],
  },
];

const FALLBACK_RESPONSE = {
  title: "Document Analysis",
  answer: [
    "I've reviewed all 7 source documents in this workspace. Here's a high-level summary:",
    "**Key takeaways:**",
    "• Project Alpha shows strong fundamentals (21% revenue CAGR, 42% gross margin, 68% recurring) but faces 3 material risk areas: customer concentration, FIRS tax dispute, and Kenya licence.",
    "• Dangote Cement is the most comparable listed peer at 11.0× EV/EBITDA. Project Alpha asking price of 12.8× is supportable given tech-enabled premium but leaves limited margin of safety.",
    "• Legal DD is largely clean — 2 amber items (land dispute, contractor claim) totalling NGN640m in contingent liabilities.",
    "• December EBITDA margin decline to 22.1% warrants investigation before signing. LPG conversion programme is the key operational assumption.",
    "Ask a specific question to drill into any of these areas.",
  ],
};

function getResponse(query: string): { title: string; answer: string[] } {
  const q = query.toLowerCase();
  for (const r of RESPONSES) {
    if (r.match.some((kw) => q.includes(kw))) return r;
  }
  return FALLBACK_RESPONSE;
}

const INITIAL_CONVERSATION: Message[] = [
  {
    role: "user",
    content: "We are meeting the management team of Project Alpha tomorrow. Draft some key DD questions based on your assessment of these documents.",
  },
  {
    role: "assistant",
    content: "",
    steps: CO_PILOT_STEPS as unknown as string[],
  },
];

const DEFAULT_DD_QUESTIONS = [
  "What is the contractual term and renewal outlook for the top-2 customers (currently 41% of revenue)?",
  "Walk us through the EBITDA margin compression in Q4 2025 — is the energy cost spike a structural shift or a one-off?",
  "What is the current status of the Kenya investment licence, and is it a condition to close?",
  "What is the FIRS's latest position on the NGN1.2bn tax dispute, and what settlement scenarios are on the table?",
  "What is the Apex Industries receivable (NGN480m) situation — credit loss or timing dispute, and what's the recovery timeline?",
  "Working capital cycle has extended from 62 to 84 days. What is driving this and what is the remediation plan?",
];

// Formats assistant message body — bold **text** → <strong>
function formatContent(text: string): JSX.Element {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function CoPilotPanel({ onClose, onOpenExportLog, initialQuery }: CoPilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_CONVERSATION);
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [ddReportVisible, setDdReportVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handledQueryRef = useRef<string | null>(null);

  // Pre-fill from query bar
  useEffect(() => {
    if (initialQuery && initialQuery !== handledQueryRef.current) {
      handledQueryRef.current = initialQuery;
      setInput(initialQuery);
      // Auto-submit
      const response = getResponse(initialQuery);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: initialQuery },
      ]);
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.answer.join("\n\n"), steps: CO_PILOT_STEPS as unknown as string[] },
        ]);
        setInput("");
      }, 1200);
    }
  }, [initialQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const submit = () => {
    const q = input.trim();
    if (!q || thinking) return;
    const response = getResponse(q);
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer.join("\n\n"), steps: CO_PILOT_STEPS as unknown as string[] },
      ]);
    }, 1100 + Math.random() * 600);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nautilus-teal shrink-0 flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">Nautilus Co-Pilot</span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">Demo</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Augmented Analyst · 7 documents indexed</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-nautilus-teal shrink-0 flex items-center justify-center text-white font-bold text-xs mt-0.5">
                N
              </div>
            )}
            <div className={`flex-1 min-w-0 ${msg.role === "user" ? "max-w-[85%]" : ""}`}>
              {msg.role === "user" ? (
                <div className="bg-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 rounded-tr-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Traceability */}
                  <div className="rounded-lg border border-teal-100 bg-teal-50/60 px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs font-semibold text-teal-700">Every answer is traceable to source documents.</span>
                    </div>
                    {msg.steps && (
                      <button
                        onClick={() => setStepsExpanded((e) => !e)}
                        className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium"
                      >
                        See the work — {msg.steps.length} steps
                        <svg className={`w-3 h-3 transition-transform ${stepsExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    {stepsExpanded && msg.steps && (
                      <ol className="mt-2 text-xs text-slate-600 space-y-1.5 max-h-40 overflow-auto">
                        {msg.steps.map((step, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="shrink-0 w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                            <span className="text-slate-600">{step}<span className="block text-slate-400 italic text-[10px]">Matrix Agent · step {i + 1}</span></span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  {/* Answer content */}
                  <div className="rounded-xl bg-white border border-slate-100 px-3 py-3 text-sm text-slate-700 space-y-2 shadow-sm">
                    {idx === 1 && messages.length === 2 ? (
                      // First static message: DD questions list
                      <>
                        <p className="text-xs font-semibold text-slate-600 mb-2">Key questions for meeting with Project Alpha</p>
                        <ol className="list-decimal list-inside space-y-2">
                          {DEFAULT_DD_QUESTIONS.map((q, i) => (
                            <li key={i} className="text-slate-700 leading-snug">{q}</li>
                          ))}
                        </ol>
                      </>
                    ) : (
                      msg.content.split("\n\n").map((para, i) => (
                        <p key={i} className="leading-relaxed">
                          {formatContent(para)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-xs font-semibold text-slate-600 mt-0.5">
                U
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {thinking && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-nautilus-teal shrink-0 flex items-center justify-center text-white font-bold text-xs mt-0.5">N</div>
            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="ml-1">Analysing documents…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div className="shrink-0 px-4 pb-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            "Key risks across all documents",
            "Valuation — entry price recommendation",
            "M&A deal structure",
            "IC Memo draft",
            "Revenue & financials summary",
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 0); }}
              className="shrink-0 px-2.5 py-1.5 rounded-full text-xs border border-slate-200 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 transition-colors bg-white whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* DD Report toggle */}
      <div className="shrink-0 px-4 pb-2 space-y-2">
        <button
          type="button"
          onClick={() => setDdReportVisible((v) => !v)}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
        >
          {ddReportVisible ? "Hide DD Report" : "Generate DD Report"}
        </button>
        {ddReportVisible && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm space-y-3 max-h-64 overflow-auto">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Risk score</p>
              <p className="font-semibold text-amber-700">Medium — 3 open items require resolution</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Summary</p>
              <p className="text-slate-700">Project Alpha demonstrates strong financials (21% CAGR, 42% gross margin, 68% recurring) but carries customer concentration risk, an unresolved FIRS tax dispute (NGN1.2bn), and a pending Kenya investment licence. EBITDA margin compression in Q4 2025 warrants investigation before signing.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Key findings</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Revenue NGN115.2bn, EBITDA NGN28.4bn (24.7% margin), net debt NGN18.2bn (Mgmt Accounts Dec 2025).</li>
                <li>Top-2 customers = 41% of revenue — concentration risk flagged (CIM v3 §8).</li>
                <li>Tax contingency NGN1.2bn with FIRS unresolved (Annual Report p.38; Legal DD p.10).</li>
                <li>Ogun plant land dispute + contractor claim: NGN640m contingent liability (Legal DD p.7).</li>
                <li>Management 2026 budget NGN135bn revenue, CapEx NGN8.2bn. LPG conversion is the key margin assumption (Board Deck Q4 2025).</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Valuation range</p>
              <p className="text-slate-700">DCF midpoint NGN1,335bn equity value. Precedent comps median 11.4× EV/EBITDA. Management asking price 12.8× is at the 75th percentile — supportable with earn-out structure.</p>
            </div>
            <p className="text-xs text-slate-500 pt-1">Include this DD Report in Export memo for the IC committee pack.</p>
          </div>
        )}
        {onOpenExportLog && (
          <button onClick={onOpenExportLog} className="text-xs text-nautilus-teal hover:underline block">
            View export log
          </button>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-100 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask Co-Pilot about your documents…"
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim() || thinking}
            className="p-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">Demo mode — responses are generated from document analysis, not live AI.</p>
      </div>
    </div>
  );
}
