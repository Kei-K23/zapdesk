"use client";

import React from "react";
import WorkspaceSidebarHeader from "./workspace-sidebar-header";
import useWorkspaceId from "../hooks/use-workspace-id";
import useGetCurrentMember from "../query/use-get-current-member";
import { useGetWorkspace } from "../query/user-get-workspace";
import { AlertTriangle, HashIcon, Loader2 } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { useGetChannels } from "@/features/channel/query/use-get-channels";
import WorkspaceSection from "./workspace-section";
import useGetMembers from "../query/use-get-members";
import MemberItem from "./member-item";
import { useCreateChannelModalStore } from "@/features/channel/store/use-create-channel-modal-store";
import useChannelId from "@/features/channel/hooks/use-channel-id";
import useMemberId from "@/features/conversations/hooks/use-member-id";

export default function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();
  const [_channelCreateModalOpen, setChannelCreateModalOpen] =
    useCreateChannelModalStore();
  const { data: currentWorkspace, isLoading: currentWorkspaceLoading } =
    useGetWorkspace({ id: workspaceId });
  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId });
  const { data: currentChannels, isLoading: currentChannelLoading } =
    useGetChannels(workspaceId);
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (
    currentMemberLoading ||
    currentWorkspaceLoading ||
    currentChannelLoading ||
    membersLoading
  ) {
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
        memberRole={currentMember.role}
      />
      <WorkspaceSection
        onNew={
          currentMember.role !== "member"
            ? () => setChannelCreateModalOpen(true)
            : undefined
        }
        label="Channels"
        hint="Create new channel"
      >
        {currentChannels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            id={channel._id}
            label={channel.name}
            icon={HashIcon}
            isActive={channel._id === channelId}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        onNew={undefined}
        label="Direct Messages"
        hint="Direct Messages"
      >
        {members?.map((member) => (
          <MemberItem
            key={member.member._id}
            id={member.member._id}
            userId={member.user._id}
            name={member.user?.name || ""}
            authorBio={member?.user?.bio}
            avatar={member.user?.image || ""}
            role={member.member.role}
            isActive={member.member._id === memberId}
            authorId={member.member._id}
            currentAuthMember={currentMember}
          />
        ))}
      </WorkspaceSection>
    </aside>
  );
}
