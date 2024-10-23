import { useGetMessages } from "@/features/messages/query/use-get-messages";
import { Id } from "../../../../convex/_generated/dataModel";
import useMemberId from "../hooks/use-member-id";
import { useGetMember } from "../query/use-get-member";
import { Loader2 } from "lucide-react";
import MessageList from "@/features/messages/components/message-list";
import ConversationHeader from "./conversation-header";
import ChatInput from "./chat-input";

interface ConversationProps {
  id: Id<"conversations">;
}

export default function Conversation({ id }: ConversationProps) {
  const memberId = useMemberId();

  const { data: member, isLoading: memberLoading } = useGetMember(memberId);
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
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
      <ConversationHeader
        memberName={member?.user?.name}
        memberProfile={member?.user?.image}
        memberLoading={memberLoading}
        role={member?.member?.role}
      />
      <MessageList
        data={results}
        loadMore={loadMore}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore"}
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        variant="conversation"
      />
      <ChatInput
        id={id}
        placeholder={`Message between you and ${member?.user?.name}`}
      />
    </div>
  );
}
