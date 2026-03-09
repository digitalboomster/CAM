import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await params;
  try {
    const body = (await request.json()) as
      | { name: string; date: string; type: string; category?: string }
      | { name: string; date: string; type: string; category?: string }[];
    const items = Array.isArray(body) ? body : [body];
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { fields: true },
    });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    const validCategories = ["Financials", "Legal", "Regulatory", "Other"];
    for (const item of items) {
      const category =
        item.category && validCategories.includes(item.category) ? item.category : "Other";
      const source = await prisma.source.create({
        data: {
          workspaceId,
          documentName: item.name,
          date: item.date,
          documentType: item.type,
          category,
        },
      });
      await prisma.cell.createMany({
        data: workspace.fields.map((f) => ({
          sourceId: source.id,
          fieldId: f.id,
          status: "reading",
        })),
      });
    }
    const sources = await prisma.source.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(sources);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add sources" }, { status: 500 });
  }
}
