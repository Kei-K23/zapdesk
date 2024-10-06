import Sidebar from "@/features/workspaces/components/sidebar";
import Toolbar from "@/features/workspaces/components/toolbar";
import React from "react";

export default function WorkspaceIdPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
