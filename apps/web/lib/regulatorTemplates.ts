/** SEC/compliance report templates for Regulator Reporting module. */
export const REGULATOR_TEMPLATES = [
  {
    id: "sec-quarterly-concentration",
    label: "SEC Quarterly Concentration",
    description: "Quarterly concentration and large position disclosure for SEC filing",
    authority: "SEC",
  },
  {
    id: "sec-liquidity-disclosure",
    label: "SEC Liquidity Disclosure",
    description: "Liquidity classification and disclosure for registered funds",
    authority: "SEC",
  },
  {
    id: "sec-aum-reconciliation",
    label: "AUM Reconciliation",
    description: "Assets under management reconciliation for regulatory reporting",
    authority: "SEC",
  },
] as const;

export type RegulatorTemplateId = (typeof REGULATOR_TEMPLATES)[number]["id"];
