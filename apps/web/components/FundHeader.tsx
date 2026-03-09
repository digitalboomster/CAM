"use client";

import Link from "next/link";
import { useFund } from "@/contexts/FundContext";

export default function FundHeader() {
  const fund = useFund();

  return (
    <header className="h-12 shrink-0 border-b border-slate-200 bg-white px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded flex items-center justify-center bg-slate-800 text-white font-bold text-xs tracking-tight">
            N
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">Nautilus</span>
          <span className="text-slate-400 text-sm">·</span>
          <span className="text-sm text-slate-600">Cordros Asset Management</span>
          <span className="text-slate-400 text-sm hidden sm:inline">·</span>
          <span className="text-xs text-slate-500 hidden sm:inline">Institutional intelligence</span>
        </Link>
      </div>
      {fund && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fund</span>
          <select
            value={fund.fundId}
            onChange={(e) => fund.setFund(e.target.value as typeof fund.fundId)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-900 bg-slate-50 focus:ring-2 focus:ring-nautilus-accent/20 focus:border-nautilus-accent outline-none"
          >
            {fund.funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
