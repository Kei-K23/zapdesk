"use client";

import { useGetChannels } from "@/features/channel/query/use-get-channels";
import { useCreateChannelModalStore } from "@/features/channel/store/use-create-channel-modal-store";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";
import { useGetWorkspace } from "@/features/workspaces/query/user-get-workspace";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function WorkspaceIdPage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModalStore();
  const { data: workspaceData, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: memberData, isLoading: memberLoading } = useGetCurrentMember({
    workspaceId,
  });
  const { data: channelData, isLoading: channelLoading } =
    useGetChannels(workspaceId);

  const channelId = useMemo(() => channelData?.[0]?._id, [channelData]);
  const isAdmin = useMemo(() => memberData?.role === "admin", [memberData]);
  console.log(channelData, "channel ");
  console.log(workspaceData, "workspace");

  useEffect(() => {
    if (
      workspaceLoading ||
      channelLoading ||
      !workspaceData ||
      memberLoading ||
      !memberData
    )
      return;

    if (channelId) {
      router.replace(`/workspaces/${workspaceId}/channels/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    memberLoading,
    memberData,
    channelId,
    channelLoading,
    open,
    router,
    workspaceData,
    workspaceId,
    workspaceLoading,
    isAdmin,
    setOpen,
  ]);

  if (workspaceLoading || channelLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-col">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspaceData) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-col">
        <TriangleAlert className="size-6 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  if (!channelData?.length) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-col">
        <TriangleAlert className="size-6 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">
          Channel are not created yet in this workspace
        </span>
      </div>
    );
  }

  return null;
}
