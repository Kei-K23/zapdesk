import dynamic from "next/dynamic";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageThumbnail from "./message-thumbnail";

const Renderer = dynamic(() => import("./renderer"), { ssr: false });

const formatFulltime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

interface MessageItemProps {
  id?: Id<"messages">;
  memberId?: Id<"members">;
  authorImage?: string;
  authorName?: string;
  body?: Doc<"messages">["body"];
  image?: string | undefined | null;
  reactions?: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  isAuthor: boolean;
  isCompact?: boolean;
  isEditing: boolean;
  hideThreadButton?: boolean;
  setEditing: (id: Id<"messages"> | null) => void;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt?: Doc<"messages">["_creationTime"];
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

export default function MessageItem({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  body,
  image,
  reactions,
  isCompact,
  isAuthor,
  isEditing,
  hideThreadButton,
  updatedAt,
  createdAt,
  threadCount,
  threadImage,
  threadTimestamp,
  setEditing,
}: MessageItemProps) {
  const fallbackAvatar = authorName.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 px-5 p-1.5 transition-all group relative hover:bg-neutral-700/40">
        <div className="group-hover:opacity-100 opacity-0 items-start gap-2">
          <button className="w-14 text-xs text-muted-foreground">
            {format(new Date(createdAt!), "hh:mm a")}
          </button>
        </div>
        <div className="mt-1 flex flex-col w-full">
          <Renderer value={body} />
          {updatedAt && (
            <span className="text-sm text-muted-foreground">(edited)</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 px-5 p-1.5 transition-all group relative hover:bg-neutral-700/40">
      <div>
        <Avatar className="size-14 hover:opacity-75 transition-all mr-2 rounded-md">
          <AvatarImage src={authorImage} alt={authorName} />
          <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className="flex items-start gap-2">
          <span className="text-sm truncate hover:underline cursor-pointer">
            {authorName}
          </span>
          <Hint label={formatFulltime(new Date(createdAt!))}>
            <button className=" text-sm text-muted-foreground">
              {format(new Date(createdAt!), "hh:mm a")}
            </button>
          </Hint>
        </div>
        <div className="mt-1 flex flex-col w-full">
          <Renderer value={body} />
          {image && <MessageThumbnail image={image} />}
          {updatedAt && (
            <span className="text-sm text-muted-foreground">(edited)</span>
          )}
        </div>
      </div>
    </div>
  );
}
