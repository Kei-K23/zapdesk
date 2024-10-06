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
      {children}
    </div>
  );
}
