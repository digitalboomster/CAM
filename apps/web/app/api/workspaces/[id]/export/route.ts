import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await params;
  try {
    const { label, exportedBy } = (await request.json()) as { label?: string; exportedBy?: string };
    const at = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const entry = await prisma.exportLogEntry.create({
      data: {
        workspaceId,
        label: label ? `${label} (PDF)` : "Export (PDF)",
        at,
        exportedBy: exportedBy ?? null,
      },
    });
    return NextResponse.json(entry);
  } catch {
    const at = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return NextResponse.json({
      id: `demo-e-${Date.now()}`,
      at,
      label: "Export (PDF)",
      workspaceId,
      exportedBy: null,
      createdAt: new Date().toISOString(),
    });
  }
}
