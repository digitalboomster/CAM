import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_DD_COLUMNS } from "@/lib/types";

const DEMO_WORKSPACE = {
  id: "demo-alpha",
  name: "Project Alpha — IC memo prep",
  projectId: null as string | null,
  project: null as { id: string; name: string } | null,
  createdAt: new Date().toISOString(),
};

function demoWorkspaceList() {
  return NextResponse.json([DEMO_WORKSPACE]);
}

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
  } catch {
    return demoWorkspaceList();
  }
}

export async function POST(request: Request) {
  let body: { name?: string; projectId?: string } = {};
  try {
    body = (await request.json()) as { name?: string; projectId?: string };
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
  } catch {
    const id = `demo-${Date.now()}`;
    const name = body.name ?? `Workspace ${Date.now()}`;
    return NextResponse.json(
      { id, name, projectId: null, createdAt: new Date().toISOString(), project: null },
      { status: 201 }
    );
  }
}
