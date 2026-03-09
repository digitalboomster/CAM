"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export const FUND_LIST = [
  { id: "milestone-2023", name: "Cordros Milestone Fund 2023" },
  { id: "growth", name: "Cordros Growth Fund" },
  { id: "fixed-income", name: "Cordros Fixed Income Fund" },
] as const;

export type FundId = (typeof FUND_LIST)[number]["id"];
export type Fund = (typeof FUND_LIST)[number];

type FundContextValue = {
  fundId: FundId;
  fundName: string;
  setFund: (id: FundId) => void;
  funds: readonly Fund[];
};

const defaultFund = FUND_LIST[0];
const FundContext = createContext<FundContextValue | null>(null);

export function FundProvider({ children }: { children: ReactNode }) {
  const [fundId, setFundId] = useState<FundId>(defaultFund.id);
  const fund = FUND_LIST.find((f) => f.id === fundId) ?? defaultFund;

  const setFund = useCallback((id: FundId) => {
    setFundId(id);
  }, []);

  const value: FundContextValue = {
    fundId: fund.id,
    fundName: fund.name,
    setFund,
    funds: FUND_LIST,
  };

  return <FundContext.Provider value={value}>{children}</FundContext.Provider>;
}

export function useFund() {
  const ctx = useContext(FundContext);
  if (!ctx) return null;
  return ctx;
}
