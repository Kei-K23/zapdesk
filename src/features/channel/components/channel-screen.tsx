"use client";

import { useEffect } from "react";
import useChannelId from "../hooks/use-channel-id";
import { useGetChannel } from "../query/use-get-channel";
import { useRouter } from "next/navigation";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import ChannelHeader from "./channel-header";
import ChatInput from "./chat-input";

export default function ChannelScreen() {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: channelData, isLoading: channelLoading } =
    useGetChannel(channelId);

  useEffect(() => {
    if (channelLoading) return;

    if (!channelData) {
      router.replace(`/workspaces/${workspaceId}`);
    }
  }, [channelData, channelLoading, router, workspaceId]);

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channel={channelData} channelLoading={channelLoading} />
      <div className="flex-1" />
      <ChatInput />
    </div>
  );
}
