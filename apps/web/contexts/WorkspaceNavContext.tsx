"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Workspace } from "@/lib/types";

type WorkspaceNavContextValue = {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setWorkspaces: (w: Workspace[]) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  onNewWorkspace: () => void;
  setOnNewWorkspace: (fn: () => void) => void;
};

const WorkspaceNavContext = createContext<WorkspaceNavContextValue | null>(null);

export function WorkspaceNavProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [newWorkspaceFn, setNewWorkspaceFn] = useState<() => void>(() => () => {});

  const onNewWorkspace = useCallback(() => {
    newWorkspaceFn();
  }, [newWorkspaceFn]);

  const setOnNewWorkspace = useCallback((fn: () => void) => {
    setNewWorkspaceFn(() => fn);
  }, []);

  const value: WorkspaceNavContextValue = {
    workspaces,
    activeWorkspaceId,
    setWorkspaces,
    setActiveWorkspaceId,
    onNewWorkspace,
    setOnNewWorkspace,
  };

  return (
    <WorkspaceNavContext.Provider value={value}>
      {children}
    </WorkspaceNavContext.Provider>
  );
}

export function useWorkspaceNav() {
  const ctx = useContext(WorkspaceNavContext);
  if (!ctx) return null;
  return ctx;
}
