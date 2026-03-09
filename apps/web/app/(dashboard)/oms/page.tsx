"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";

type OrderStatus = "executed" | "pending" | "partial" | "cancelled" | "rejected";
type Side = "Buy" | "Sell";

interface Order {
  id: string;
  time: string;
  security: string;
  exchange: string;
  side: Side;
  qty: string;
  price: string;
  value: string;
  status: OrderStatus;
  fund: string;
  compliance: string;
}

const BLOTTER: Order[] = [
  { id: "ORD-2026-0084", time: "09:42", security: "Dangote Cement (DANGCEM)", exchange: "NGX", side: "Sell", qty: "1,200,000", price: "₦338.50", value: "₦406.2m", status: "executed", fund: "Milestone 2023", compliance: "Passed" },
  { id: "ORD-2026-0083", time: "09:38", security: "MTN Nigeria (MTNN)", exchange: "NGX", side: "Buy", qty: "980,000", price: "₦312.00", value: "₦305.8m", status: "executed", fund: "Milestone 2023", compliance: "Passed" },
  { id: "ORD-2026-0082", time: "09:31", security: "BUA Cement (BUACEMENT)", exchange: "NGX", side: "Sell", qty: "850,000", price: "₦379.00", value: "₦322.2m", status: "partial", fund: "Milestone 2023", compliance: "Passed" },
  { id: "ORD-2026-0081", time: "09:15", security: "FGN Bond MAR-2030", exchange: "FMDQ", side: "Buy", qty: "40,000 units", price: "₦10,150", value: "₦406.0m", status: "pending", fund: "Fixed Income Fund", compliance: "Passed" },
  { id: "ORD-2026-0080", time: "09:10", security: "Zenith Bank (ZENITHBANK)", exchange: "NGX", side: "Buy", qty: "420,000", price: "₦202.50", value: "₦85.1m", status: "pending", fund: "Growth Fund", compliance: "Passed" },
  { id: "ORD-2026-0079", time: "08:55", security: "Seplat Energy (SEPLAT)", exchange: "NGX", side: "Buy", qty: "300,000", price: "₦4,850", value: "₦1.46bn", status: "rejected", fund: "Milestone 2023", compliance: "Breach: exceeds 10% single-stock limit" },
];

const STATUS_STYLE: Record<OrderStatus, { badge: string; label: string }> = {
  executed: { badge: "bg-emerald-100 text-emerald-800", label: "Executed" },
  pending: { badge: "bg-blue-100 text-blue-800", label: "Pending" },
  partial: { badge: "bg-amber-100 text-amber-800", label: "Partial fill" },
  cancelled: { badge: "bg-slate-100 text-slate-600", label: "Cancelled" },
  rejected: { badge: "bg-red-100 text-red-800", label: "Rejected" },
};

const SECURITIES = ["Dangote Cement (DANGCEM)", "MTN Nigeria (MTNN)", "GTCO (GTCO)", "Zenith Bank (ZENITHBANK)", "BUA Cement (BUACEMENT)", "Nestlé Nigeria (NESTLE)", "FGN Bond MAR-2030", "FGN Bond SEP-2027"];
const FUNDS = ["Milestone 2023", "Growth Fund", "Fixed Income Fund"];
const EXCHANGES = ["NGX", "FMDQ"];

export default function OmsPage() {
  const [activeTab, setActiveTab] = useState<"blotter" | "entry">("blotter");
  const [security, setSecurity] = useState(SECURITIES[0]);
  const [exchange, setExchange] = useState("NGX");
  const [side, setSide] = useState<Side>("Buy");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [fund, setFund] = useState(FUNDS[0]);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | { passed: boolean; message: string }>(null);
  const [submitted, setSubmitted] = useState(false);

  const checkCompliance = () => {
    setChecking(true);
    setCheckResult(null);
    setTimeout(() => {
      setChecking(false);
      const value = (parseFloat(qty.replace(/,/g, "")) || 0) * (parseFloat(price.replace(/[₦,]/g, "")) || 0);
      const breach = value > 1_400_000_000;
      setCheckResult(
        breach
          ? { passed: false, message: "Breach: order value exceeds 10% single-stock concentration limit for the selected fund." }
          : { passed: true, message: "Pre-trade check passed. Order complies with mandate and SEC limits. Proceed to submit." }
      );
    }, 1100);
  };

  const submitOrder = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <ModuleShell
      title="Order Management"
      subtitle="Order entry, pre-trade compliance check, and execution blotter"
      action={{ label: "Rebalancing", href: "/rebalancing" }}
    >
      <div className="space-y-5 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Today's orders", value: BLOTTER.length.toString() },
            { label: "Executed", value: BLOTTER.filter((o) => o.status === "executed").toString().replace("[object Object]", ""), realValue: BLOTTER.filter((o) => o.status === "executed").length.toString() },
            { label: "Pending", value: BLOTTER.filter((o) => o.status === "pending").length.toString() },
            { label: "Rejected", value: BLOTTER.filter((o) => o.status === "rejected").length.toString() },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.label === "Rejected" && s.value !== "0" ? "text-red-600" : s.label === "Pending" ? "text-blue-600" : s.label === "Executed" ? "text-emerald-600" : "text-slate-900"}`}>
                {s.realValue ?? s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(["blotter", "entry"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "blotter" ? "Order blotter" : "New order"}
            </button>
          ))}
        </div>

        {activeTab === "blotter" && (
          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Security</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Fund</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-700">Side</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Qty</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Price</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Value</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {BLOTTER.map((o) => (
                  <tr key={o.id} className={`border-b border-slate-100 hover:bg-slate-50/50 ${o.status === "rejected" ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{o.id}<br /><span className="text-slate-400">{o.time}</span></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{o.security}</p>
                      <p className="text-xs text-slate-500">{o.exchange}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{o.fund}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${o.side === "Buy" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                        {o.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{o.qty}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{o.price}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{o.value}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[o.status].badge}`}>
                        {STATUS_STYLE[o.status].label}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs ${o.status === "rejected" ? "text-red-700 font-medium" : "text-emerald-700"}`}>
                      {o.compliance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "entry" && (
          <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <p className="text-sm text-slate-600">Enter order details. Pre-trade compliance check is mandatory before submission.</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Security</label>
                <select value={security} onChange={(e) => setSecurity(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none">
                  {SECURITIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Exchange</label>
                <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none">
                  {EXCHANGES.map((ex) => <option key={ex}>{ex}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Side</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  {(["Buy", "Sell"] as Side[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSide(s)}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        side === s
                          ? s === "Buy" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                <input type="text" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 500,000" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Price (₦)</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 338.50" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Fund</label>
                <select value={fund} onChange={(e) => setFund(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none">
                  {FUNDS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <button
                type="button"
                onClick={checkCompliance}
                disabled={checking || !qty || !price}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                {checking ? "Running pre-trade check…" : "Run pre-trade compliance check"}
              </button>

              {checkResult && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${checkResult.passed ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"}`}>
                  <p className="font-semibold mb-0.5">{checkResult.passed ? "Check passed" : "Check failed"}</p>
                  <p>{checkResult.message}</p>
                </div>
              )}

              <button
                type="button"
                onClick={submitOrder}
                disabled={!checkResult?.passed || submitted}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 transition-colors"
              >
                {submitted ? "Order submitted to NGX/FMDQ" : "Submit order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
