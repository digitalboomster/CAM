import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list deal targets" }, { status: 500 });
  }
}
