import dynamic from "next/dynamic";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

const Renderer = dynamic(() => import("./renderer"), { ssr: false });

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
  return (
    <div>
      <Renderer value={body} />
    </div>
  );
}
