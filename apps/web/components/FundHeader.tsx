"use client";

import Link from "next/link";
import { useFund } from "@/contexts/FundContext";

export default function FundHeader() {
  const fund = useFund();

  return (
    <header className="h-12 shrink-0 border-b border-slate-100 bg-white px-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-800 tracking-tight">Nautilus</span>
          <span className="text-slate-200">·</span>
          <span className="text-[13px] text-slate-500">Cordros Asset Management</span>
          <span className="text-slate-200 hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 hidden sm:inline">Institutional intelligence</span>
        </Link>
      </div>
      {fund && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Fund</span>
          <select
            value={fund.fundId}
            onChange={(e) => fund.setFund(e.target.value as typeof fund.fundId)}
            className="rounded-lg border border-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-800 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 outline-none"
          >
            {fund.funds.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
