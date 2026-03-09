import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { workspaces: true } },
      },
    });
    return NextResponse.json(
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        fundId: p.fundId,
        createdAt: p.createdAt.toISOString(),
        workspaceCount: p._count.workspaces,
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  let body: { name?: string; fundId?: string } = {};
  try {
    body = (await request.json()) as { name?: string; fundId?: string };
    const project = await prisma.project.create({
      data: {
        name: body.name ?? `Project ${Date.now()}`,
        fundId: body.fundId ?? null,
      },
    });
    return NextResponse.json({
      id: project.id,
      name: project.name,
      fundId: project.fundId,
      createdAt: project.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({
      id: `demo-p-${Date.now()}`,
      name: body.name ?? `Project ${Date.now()}`,
      fundId: body.fundId ?? null,
      createdAt: new Date().toISOString(),
    });
  }
}
