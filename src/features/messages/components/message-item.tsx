import { Doc, Id } from "../../../../convex/_generated/dataModel";

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

export default function MessageItem({}: MessageItemProps) {
  return <div></div>;
}
