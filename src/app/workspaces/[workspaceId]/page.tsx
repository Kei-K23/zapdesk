"use client";

import { useGetChannels } from "@/features/channel/query/use-get-channels";
import { useCreateChannelModalStore } from "@/features/channel/store/use-create-channel-modal-store";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
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
  const { data: channelData, isLoading: channelLoading } =
    useGetChannels(workspaceId);

  const channelId = useMemo(() => channelData?.[0]?._id, [channelData]);

  useEffect(() => {
    if (workspaceLoading || channelLoading || !workspaceData) return;

    if (channelId) {
      router.replace(`/workspaces/${workspaceId}/channels/${channelId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [
    channelId,
    channelLoading,
    open,
    router,
    setOpen,
    workspaceData,
    workspaceId,
    workspaceLoading,
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
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return null;
}
