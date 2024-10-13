"use client";

import React from "react";
import WorkspaceSidebarHeader from "./workspace-sidebar-header";
import useWorkspaceId from "../hooks/use-workspace-id";
import useGetCurrentMember from "../query/use-get-current-member";
import { useGetWorkspace } from "../query/user-get-workspace";
import {
  AlertTriangle,
  HashIcon,
  Loader2,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import SidebarItem from "./sidebar-item";
import { useGetChannels } from "@/features/channel/query/use-get-channels";

export default function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();
  const { data: currentWorkspace, isLoading: currentWorkspaceLoading } =
    useGetWorkspace({ id: workspaceId });
  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId });
  const { data: currentChannels, isLoading: currentChannelsLoading } =
    useGetChannels(workspaceId);

  if (currentMemberLoading || currentWorkspaceLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-1 text-white">
        <p>Loading the workspace...</p>
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!currentMember || !currentWorkspace) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-1 text-white">
        <AlertTriangle className="size-6" />
        <p>Workspace not found</p>
      </div>
    );
  }

  return (
    <aside className="h-full p-2 text-white">
      <WorkspaceSidebarHeader
        workspace={currentWorkspace}
        isAdmin={currentMember.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" id="thread" icon={MessageSquareText} />
        <SidebarItem label="Drafts & Sent" id="thread" icon={SendHorizonal} />
        {currentChannels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            id={channel._id}
            label={channel.name}
            icon={HashIcon}
          />
        ))}
      </div>
    </aside>
  );
}
