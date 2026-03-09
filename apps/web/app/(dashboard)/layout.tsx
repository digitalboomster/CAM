"use client";

import { WorkspaceNavProvider } from "@/contexts/WorkspaceNavContext";
import { FundProvider } from "@/contexts/FundContext";
import { DashboardErrorBoundary } from "@/components/DashboardErrorBoundary";
import FundHeader from "@/components/FundHeader";
import NautilusSidebar from "@/components/NautilusSidebar";
import CommandPalette from "@/components/CommandPalette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceNavProvider>
      <FundProvider>
        <div className="flex h-screen overflow-hidden bg-slate-100" style={{ minHeight: "100vh", backgroundColor: "var(--nautilus-bg)" }}>
          <NautilusSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden min-h-0 ml-64">
            <FundHeader />
            <DashboardErrorBoundary>
              {children}
            </DashboardErrorBoundary>
            <CommandPalette />
          </div>
        </div>
      </FundProvider>
    </WorkspaceNavProvider>
  );
}
