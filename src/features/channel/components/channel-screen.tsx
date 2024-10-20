"use client";

import { useEffect } from "react";
import useChannelId from "../hooks/use-channel-id";
import { useGetChannel } from "../query/use-get-channel";
import { useRouter } from "next/navigation";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import ChannelHeader from "./channel-header";
import ChatInput from "./chat-input";
import { useGetMessages } from "@/features/messages/query/use-get-messages";
import { Loader2 } from "lucide-react";
import MessageList from "@/features/messages/components/message-list";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";

export default function ChannelScreen() {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: channelData, isLoading: channelLoading } =
    useGetChannel(channelId);
  const { results, status, loadMore } = useGetMessages({
    channelId,
  });
  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId });

  useEffect(() => {
    if (channelLoading) return;

    if (!channelData) {
      router.replace(`/workspaces/${workspaceId}`);
    }
  }, [channelData, channelLoading, router, workspaceId]);

  if (channelLoading || currentMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <Loader2 className="size-6 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground text-center">
          Loading message...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader
        channel={channelData}
        channelLoading={channelLoading}
        memberRole={currentMember?.role}
      />
      <MessageList
        channelName={channelData?.name}
        channelCreationTime={channelData?._creationTime}
        data={results}
        loadMore={loadMore}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore"}
      />
      <ChatInput placeholder={`Message # ${channelData?.name}`} />
    </div>
  );
}
