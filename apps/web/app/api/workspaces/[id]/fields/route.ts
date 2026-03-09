import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await params;
  try {
    const { name } = (await request.json()) as { name?: string };
    if (!name?.trim()) {
      return NextResponse.json({ error: "Field name required" }, { status: 400 });
    }
    const count = await prisma.field.count({ where: { workspaceId } });
    const field = await prisma.field.create({
      data: { workspaceId, name: name.trim(), sortOrder: count },
    });
    const sources = await prisma.source.findMany({ where: { workspaceId }, select: { id: true } });
    if (sources.length > 0) {
      await prisma.cell.createMany({
        data: sources.map((s) => ({
          sourceId: s.id,
          fieldId: field.id,
          status: "reading",
        })),
      });
    }
    return NextResponse.json(field);
  } catch {
    return NextResponse.json({ id: `demo-f-${Date.now()}`, name: "New field", sortOrder: 0 });
  }
}
