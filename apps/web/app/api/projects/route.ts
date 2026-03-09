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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; fundId?: string };
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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
