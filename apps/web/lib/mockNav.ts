import type { FundId } from "@/contexts/FundContext";

/** Mock NAV per fund for dashboard display. */
export function getMockNav(fundId: FundId): { nav: string; asOf: string } {
  const now = new Date();
  const asOf = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  switch (fundId) {
    case "milestone-2023":
      return { nav: "124.52", asOf };
    case "growth":
      return { nav: "18.76", asOf };
    case "fixed-income":
      return { nav: "9.31", asOf };
    default:
      return { nav: "—", asOf };
  }
}
