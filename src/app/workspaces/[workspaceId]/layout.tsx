import Sidebar from "@/features/workspaces/components/sidebar";
import Toolbar from "@/features/workspaces/components/toolbar";
import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/features/workspaces/components/workspace-sidebar";

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
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"jr-slack-panel"}
        >
          <ResizablePanel
            defaultSize={20}
            minSize={12}
            className="bg-neutral-800/70"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
