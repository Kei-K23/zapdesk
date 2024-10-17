import React from "react";
import { GetMessagesReturnType } from "../query/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import MessageItem from "./message-item";
import ChannelHero from "@/features/channel/components/channel-hero";

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
}: MessageListProps) {
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
                body={message?.body}
                image={message?.image}
                reactions={message?.reactions}
                isAuthor={false}
                isCompact={isCompact}
                isEditing={false}
                hideThreadButton={false}
                setEditing={() => {}}
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
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
}
