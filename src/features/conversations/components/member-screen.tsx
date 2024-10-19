"use client";

import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import useMemberId from "../hooks/use-member-id";
import useCreateOrGetConversation from "../mutation/use-create-or-get-conversation";
import Conversation from "./conversation";

export default function MemberScreen() {
  const { toast } = useToast();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const {
    data,
    mutate: mutateConversation,
    isPending: mutateConversationLoading,
  } = useCreateOrGetConversation();

  useEffect(() => {
    mutateConversation(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (id) => {
          setConversationId(id);
        },
        onError: () => {
          toast({
            title: "Cannot load the conversation",
          });
        },
      }
    );
  }, [workspaceId, memberId, mutateConversation, toast]);

  if (mutateConversationLoading) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <Loader2 className="size-6 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground text-center">
          Loading message...
        </p>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Conversation not found
        </p>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
}
