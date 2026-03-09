import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const entries = await prisma.exportLogEntry.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(
      entries.map((e) => ({
        id: e.id,
        at: e.at,
        label: e.label,
        workspaceId: e.workspaceId ?? undefined,
        exportedBy: e.exportedBy ?? undefined,
        createdAt: e.createdAt.toISOString(),
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Database not available", code: "DB_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
