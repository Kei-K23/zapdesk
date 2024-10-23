import React, { useState } from "react";
import { GetMessagesReturnType } from "../query/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import MessageItem from "./message-item";
import ChannelHero from "@/features/channel/components/channel-hero";
import { Id } from "../../../../convex/_generated/dataModel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";
import { Loader } from "lucide-react";
import ConversationHero from "@/features/conversations/components/conversation-hero";

const TIME_THRESHOLD = 2;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  canLoadMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  parentMessageItem?: () => React.JSX.Element;
}

const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export default function MessageList({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  canLoadMore,
  isLoadingMore,
  loadMore,
  parentMessageItem,
}: MessageListProps) {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentMemberData } = useGetCurrentMember({ workspaceId });

  const groupedData = data?.reduce(
    (acc, message) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const date = new Date(message?._creationTime!);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].unshift(message);

      return acc;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="pb-4 flex-1 flex flex-col-reverse overflow-y-auto message-scrollbar">
      {Object.entries(groupedData || {}).map(([dateKey, data]) => (
        <div key={dateKey}>
          <div className="text-center my-3 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-neutral-600" />
            <span className="bg-neutral-900 text-white py-1 px-4 text-xs relative rounded-2xl ">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {data.map((message, index) => {
            if (!message) return;

            const prevMessage = data[index - 1];
            const isCompact =
              prevMessage?.user?._id === message?.user?._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <MessageItem
                key={message?._id}
                id={message?._id}
                memberId={message?.memberId}
                authorImage={message?.user?.image}
                authorName={message?.user?.name}
                role={message?.member?.role}
                body={message?.body}
                image={message?.image}
                reactions={message?.reactions}
                isAuthor={message.memberId === currentMemberData?._id}
                isCompact={isCompact}
                isEditing={editingId === message?._id}
                hideThreadButton={variant === "thread"}
                setEditing={setEditingId}
                updatedAt={message?.updatedAt}
                createdAt={message?._creationTime}
                threadCount={message?.threadCount}
                threadImage={message?.threadImage}
                threadTimestamp={message?.threadTimestamp}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(e) => {
          if (e) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              {
                threshold: 1.0,
              }
            );
            observer.observe(e);
            return () => observer.disconnect();
          }
        }}
      />

      {isLoadingMore && (
        <div className="text-center my-3 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-neutral-600" />
          <div className="flex items-center justify-center">
            <span className="bg-neutral-900 text-white py-1 px-4 text-xs relative rounded-2xl">
              <Loader className="size-4 animate-spin text-muted-foreground text-center" />
            </span>
          </div>
        </div>
      )}
      {variant === "thread" && !!parentMessageItem && parentMessageItem()}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && memberName && (
        <ConversationHero name={memberName} image={memberImage} />
      )}
    </div>
  );
}
