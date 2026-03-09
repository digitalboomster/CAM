import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_CATEGORIES = ["Financials", "Legal", "Regulatory", "Other"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; sourceId: string }> }
) {
  const { id: workspaceId, sourceId } = await params;
  try {
    const body = (await request.json()) as { category?: string };
    if (typeof body.category !== "string" || !VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    const source = await prisma.source.findFirst({
      where: { id: sourceId, workspaceId },
    });
    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }
    await prisma.source.update({
      where: { id: sourceId },
      data: { category: body.category },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update source" }, { status: 500 });
  }
}
