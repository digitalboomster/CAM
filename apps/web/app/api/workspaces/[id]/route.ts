import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { WorkspaceGridData, WorkspaceRow, WorkspaceCell } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        sources: { orderBy: { createdAt: "asc" } },
        fields: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    const fieldIds = workspace.fields.map((f) => f.id);
    const fieldIdToIndex = Object.fromEntries(workspace.fields.map((f, i) => [f.id, i]));
    const cells = await prisma.cell.findMany({
      where: { sourceId: { in: workspace.sources.map((s) => s.id) } },
    });
    const cellMap = new Map<string, WorkspaceCell>();
    for (const c of cells) {
      cellMap.set(`${c.sourceId}:${c.fieldId}`, {
        status: c.status as WorkspaceCell["status"],
        text: c.text ?? undefined,
        source: c.citationSource ?? undefined,
        docRef: c.citationDocRef ?? undefined,
        stepId: c.stepId ?? undefined,
      });
    }
    const rows: WorkspaceRow[] = workspace.sources.map((s) => ({
      id: s.id,
      documentName: s.documentName,
      date: s.date,
      documentType: s.documentType,
      category: (s.category && ["Financials", "Legal", "Regulatory", "Other"].includes(s.category)
        ? s.category
        : "Other") as WorkspaceRow["category"],
      cells: fieldIds.map((fid) => cellMap.get(`${s.id}:${fid}`) ?? { status: "reading" as const }),
    }));
    const grid: WorkspaceGridData = {
      extractionColumns: workspace.fields.map((f) => f.name),
      rows,
    };
    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        projectId: workspace.projectId,
        createdAt: workspace.createdAt.toISOString(),
      },
      grid,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load workspace" }, { status: 500 });
  }
}
