"use client";

import Sidebar from "@/features/workspaces/components/sidebar";
import Toolbar from "@/features/workspaces/components/toolbar";
import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/features/workspaces/components/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import Thread from "@/features/messages/components/thread";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMemberProfilePanel } from "@/hooks/use-member-profile-panel";
import MemberProfilePanel from "@/features/workspaces/components/member-profile-panel";

export default function WorkspaceIdPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { parentMessageId, onClose } = usePanel();
  const openPanel = !!parentMessageId;
  const { memberProfileId, onClose: memberProfileClose } =
    useMemberProfilePanel();
  const openMemberProfilePanel = !!memberProfileId;

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
            minSize={18}
            maxSize={30}
            className="bg-neutral-800/50"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={60}
            minSize={30}
            className="bg-neutral-700/50"
          >
            {children}
          </ResizablePanel>
          {openPanel && (
            <>
              <ResizableHandle withHandle className="bg-neutral-600" />
              <ResizablePanel
                defaultSize={29}
                minSize={20}
                className="bg-neutral-700/50"
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  <div>
                    <Loader />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
          {openMemberProfilePanel && (
            <>
              <ResizableHandle withHandle className="bg-neutral-600" />
              <ResizablePanel
                defaultSize={29}
                minSize={20}
                className="bg-neutral-700/50"
              >
                {memberProfileId ? (
                  <MemberProfilePanel
                    memberId={memberProfileId as Id<"members">}
                    onClose={memberProfileClose}
                  />
                ) : (
                  <div>
                    <Loader />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
