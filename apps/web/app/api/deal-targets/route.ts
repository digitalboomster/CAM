import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEMO_TARGETS = [
  { id: "t-001", name: "Apex Industrials Plc", summary: "Mid-cap industrials consolidator with pan-Nigeria distribution.", marketMultiple: "10.8× EV/EBITDA", regulatoryFlag: "Under review", sourceRef: "Project Alpha CIM v3", sourceDetail: "§8 Risk Factors", createdAt: "2026-03-01T09:00:00.000Z" },
  { id: "t-002", name: "Sahara Consumer Group", summary: "Staples platform with resilient cash flows.", marketMultiple: "14.2× P/E", regulatoryFlag: "Clean", sourceRef: "Board Strategy Deck Q4 2025", sourceDetail: "Slide 7", createdAt: "2026-02-27T13:20:00.000Z" },
  { id: "t-003", name: "NilePay (Fintech)", summary: "Payments + SME credit infrastructure.", marketMultiple: "3.1× EV/Revenue", regulatoryFlag: "Flagged", sourceRef: "Legal Due Diligence Summary", sourceDetail: "p.4", createdAt: "2026-02-18T16:05:00.000Z" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase();
    const targets = await prisma.dealTarget.findMany({
      orderBy: { createdAt: "desc" },
    });
    const filtered = q
      ? targets.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            (t.summary && t.summary.toLowerCase().includes(q)) ||
            (t.regulatoryFlag && t.regulatoryFlag.toLowerCase().includes(q))
        )
      : targets;
    return NextResponse.json(
      filtered.map((t) => ({
        id: t.id,
        name: t.name,
        summary: t.summary,
        marketMultiple: t.marketMultiple,
        regulatoryFlag: t.regulatoryFlag,
        sourceRef: t.sourceRef,
        sourceDetail: t.sourceDetail,
        createdAt: t.createdAt.toISOString(),
      }))
    );
  } catch {
    const q = new URL(request.url).searchParams.get("q")?.trim().toLowerCase();
    const list = q ? DEMO_TARGETS.filter((t) => t.name.toLowerCase().includes(q) || (t.summary && t.summary.toLowerCase().includes(q))) : DEMO_TARGETS;
    return NextResponse.json(list);
  }
}
