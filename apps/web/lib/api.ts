import type { Workspace, WorkspaceGridData, ExportLogEntry, Project } from "./types";

const base = "";

async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json();
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${base}/api/projects`);
  const list = await handleRes<{ id: string; name: string; fundId?: string | null; createdAt: string }[]>(res);
  return list.map((p) => ({ ...p, createdAt: new Date(p.createdAt).toISOString() }));
}

export async function createProject(name: string, fundId?: string | null): Promise<Project> {
  const res = await fetch(`${base}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, fundId: fundId ?? undefined }),
  });
  const p = await handleRes<{ id: string; name: string; fundId?: string | null; createdAt: string }>(res);
  return { ...p, createdAt: new Date(p.createdAt).toISOString() };
}

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const res = await fetch(`${base}/api/workspaces`);
  const list = await handleRes<{
    id: string;
    name: string;
    projectId?: string | null;
    project?: { id: string; name: string } | null;
    createdAt: string;
  }[]>(res);
  return list.map((w) => ({ ...w, createdAt: new Date(w.createdAt).toISOString() }));
}

export async function createWorkspace(name: string, projectId?: string | null): Promise<Workspace> {
  const res = await fetch(`${base}/api/workspaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, projectId: projectId ?? undefined }),
  });
  const w = await handleRes<{ id: string; name: string; projectId?: string | null; createdAt: string }>(res);
  return { ...w, createdAt: new Date(w.createdAt).toISOString() };
}

export async function fetchWorkspaceGrid(workspaceId: string): Promise<{ workspace: Workspace; grid: WorkspaceGridData }> {
  const res = await fetch(`${base}/api/workspaces/${workspaceId}`);
  const data = await handleRes<{
    workspace: { id: string; name: string; createdAt: string };
    grid: WorkspaceGridData;
  }>(res);
  return {
    workspace: {
      ...data.workspace,
      createdAt: new Date(data.workspace.createdAt).toISOString(),
    },
    grid: data.grid,
  };
}

export async function addSources(
  workspaceId: string,
  sources: { name: string; date: string; type: string; category?: string }[]
): Promise<void> {
  const res = await fetch(`${base}/api/workspaces/${workspaceId}/sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sources),
  });
  await handleRes<unknown>(res);
}

export async function updateSourceCategory(
  workspaceId: string,
  sourceId: string,
  category: string
): Promise<void> {
  const res = await fetch(`${base}/api/workspaces/${workspaceId}/sources/${sourceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category }),
  });
  await handleRes<unknown>(res);
}

export async function addField(workspaceId: string, name: string): Promise<void> {
  const res = await fetch(`${base}/api/workspaces/${workspaceId}/fields`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  await handleRes<unknown>(res);
}

export async function recordExport(
  workspaceId: string,
  label: string,
  exportedBy?: string
): Promise<void> {
  const res = await fetch(`${base}/api/workspaces/${workspaceId}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, exportedBy }),
  });
  await handleRes<unknown>(res);
}

/** Returns the URL to download the workspace memo as PDF. Call and use as download link or fetch + blob. */
export function getExportPdfUrl(workspaceId: string, label: string): string {
  return `${base}/api/workspaces/${workspaceId}/export/pdf?label=${encodeURIComponent(label)}`;
}

export async function fetchExportLog(): Promise<ExportLogEntry[]> {
  const res = await fetch(`${base}/api/exports`);
  return handleRes<ExportLogEntry[]>(res);
}

export interface DealTarget {
  id: string;
  name: string;
  summary?: string | null;
  marketMultiple?: string | null;
  regulatoryFlag?: string | null;
  sourceRef?: string | null;
  sourceDetail?: string | null;
  createdAt: string;
}

export async function fetchDealTargets(query?: string): Promise<DealTarget[]> {
  const url = query ? `${base}/api/deal-targets?q=${encodeURIComponent(query)}` : `${base}/api/deal-targets`;
  const res = await fetch(url);
  const list = await handleRes<DealTarget[]>(res);
  return list.map((t) => ({ ...t, createdAt: new Date(t.createdAt).toISOString() }));
}
