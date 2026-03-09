import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createDefaultDDGridData } from "@/lib/defaults";
import { jsPDF } from "jspdf";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await params;
  const { searchParams } = new URL(request.url);
  const label = searchParams.get("label") ?? "Memo export";

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        sources: { orderBy: { createdAt: "asc" } },
        fields: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const fieldIds = workspace.fields.map((f) => f.id);
    const fieldIdToName = Object.fromEntries(workspace.fields.map((f) => [f.id, f.name]));
    const cells = await prisma.cell.findMany({
      where: { sourceId: { in: workspace.sources.map((s) => s.id) } },
    });
    const cellMap = new Map<string, { text?: string; source?: string; docRef?: string }>();
    for (const c of cells) {
      cellMap.set(`${c.sourceId}:${c.fieldId}`, {
        text: c.text ?? undefined,
        source: c.citationSource ?? undefined,
        docRef: c.citationDocRef ?? undefined,
      });
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210; // A4 width in mm
    const margin = 15;
    let y = margin;
    const lineH = 6;

    doc.setFontSize(16);
    doc.text(workspace.name, margin, y);
    y += lineH + 2;
    doc.setFontSize(10);
    doc.text(`Export: ${label}`, margin, y);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y + lineH);
    y += lineH * 2 + 4;

    const colNames = ["Source", "Date", "Type", ...workspace.fields.map((f) => f.name)];
    const colCount = colNames.length;
    const colW = (pageW - margin * 2) / colCount;
    const headH = 8;
    const rowH = 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    colNames.forEach((name, i) => {
      doc.text(name.substring(0, 12), margin + i * colW + 2, y + 5);
    });
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, pageW - margin * 2, headH);
    y += headH;

    doc.setFont("helvetica", "normal");
    for (const src of workspace.sources) {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      const rowCells: string[] = [
        src.documentName.substring(0, 15),
        src.date,
        src.documentType.substring(0, 8),
      ];
      for (const fid of fieldIds) {
        const cell = cellMap.get(`${src.id}:${fid}`);
        const text = cell?.text ?? "—";
        rowCells.push(text.substring(0, 20));
      }
      rowCells.forEach((val, i) => {
        doc.text(val, margin + i * colW + 2, y + 5);
      });
      doc.rect(margin, y, pageW - margin * 2, rowH);
      y += rowH;
    }

    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Produced by Nautilus Matrix Agent. Citations and source references are stored in the platform export log.", margin, y);
    doc.text("Each cell is traceable to source document and agent step in the platform.", margin, y + lineH);
    doc.text("Nautilus | Cordros Asset Management", margin, y + lineH * 2);

    const buf = doc.output("arraybuffer");
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(label)}.pdf"`,
      },
    });
  } catch {
    const grid = createDefaultDDGridData();
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 15;
    let y = margin;
    const lineH = 6;
    doc.setFontSize(16);
    doc.text("Project Alpha — IC memo prep", margin, y);
    y += lineH + 2;
    doc.setFontSize(10);
    doc.text(`Export: ${label}`, margin, y);
    doc.text(`Generated: ${new Date().toLocaleString()} (demo)`, margin, y + lineH);
    y += lineH * 2 + 4;
    const colNames = ["Source", "Date", "Type", ...grid.extractionColumns];
    const colW = (pageW - margin * 2) / colNames.length;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    colNames.forEach((name, i) => doc.text(name.substring(0, 12), margin + i * colW + 2, y + 5));
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, pageW - margin * 2, 8);
    y += 8;
    doc.setFont("helvetica", "normal");
    for (const row of grid.rows) {
      if (y > 270) { doc.addPage(); y = margin; }
      const cells = [row.documentName.substring(0, 15), row.date, row.documentType.substring(0, 8), ...row.cells.map((c) => (c.text ?? "—").substring(0, 20))];
      cells.forEach((val, i) => doc.text(val, margin + i * colW + 2, y + 5));
      doc.rect(margin, y, pageW - margin * 2, 8);
      y += 8;
    }
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Produced by Nautilus (demo mode). Connect a database to persist exports.", margin, y);
    const buf = doc.output("arraybuffer");
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(label)}.pdf"`,
      },
    });
  }
}
