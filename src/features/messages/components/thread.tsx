import React, { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import ThreadHeader from "./thread-header";
import { useGetMessage } from "../query/use-get-message";
import MessageItem from "./message-item";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { AlertTriangleIcon, Loader2 } from "lucide-react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export default function Thread({ messageId, onClose }: ThreadProps) {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: currentMemberData, isLoading: currentMemberDataLoading } =
    useGetCurrentMember({
      workspaceId,
    });
  const { data: threadMessage, isLoading: threadMessageLoading } =
    useGetMessage(messageId);

  return (
    <div className="flex flex-col h-full">
      <ThreadHeader onClose={onClose} />
      {threadMessageLoading ? (
        <div className="flex-1 h-full flex flex-col justify-center items-center">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
          <span>Loading the message</span>
        </div>
      ) : !!threadMessage ? (
        <MessageItem
          key={threadMessage?._id}
          id={threadMessage?._id}
          memberId={threadMessage?.memberId}
          authorImage={threadMessage?.user?.image}
          authorName={threadMessage?.user?.name}
          body={threadMessage?.body}
          image={threadMessage?.image}
          reactions={threadMessage?.reactions}
          isAuthor={threadMessage?.memberId === currentMemberData?._id}
          isEditing={editingId === threadMessage?._id}
          hideThreadButton={true}
          setEditing={setEditingId}
          updatedAt={threadMessage?.updatedAt}
          createdAt={threadMessage?._creationTime}
        />
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <span>No message found</span>
        </div>
      )}
    </div>
  );
}
