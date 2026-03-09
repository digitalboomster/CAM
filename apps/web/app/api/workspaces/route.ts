import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_DD_COLUMNS } from "@/lib/types";

export async function GET() {
  try {
    const workspaces = await prisma.workspace.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: { select: { id: true, name: true } } },
    });
    if (workspaces.length === 0) {
      const created = await prisma.workspace.create({
        data: {
          name: "Project Alpha — IC memo prep",
          fields: {
            create: DEFAULT_DD_COLUMNS.map((name, i) => ({ name, sortOrder: i })),
          },
        },
        include: { project: { select: { id: true, name: true } } },
      });
      return NextResponse.json([
        {
          id: created.id,
          name: created.name,
          projectId: created.projectId ?? null,
          createdAt: created.createdAt.toISOString(),
          project: created.project,
        },
      ]);
    }
    return NextResponse.json(
      workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        projectId: w.projectId,
        createdAt: w.createdAt.toISOString(),
        project: w.project,
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; projectId?: string };
    const workspace = await prisma.workspace.create({
      data: {
        name: body.name ?? `Workspace ${Date.now()}`,
        projectId: body.projectId ?? null,
        fields: {
          create: DEFAULT_DD_COLUMNS.map((n, i) => ({ name: n, sortOrder: i })),
        },
      },
      include: { project: { select: { id: true, name: true } } },
    });
    return NextResponse.json({
      id: workspace.id,
      name: workspace.name,
      projectId: workspace.projectId,
      createdAt: workspace.createdAt.toISOString(),
      project: workspace.project,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}
