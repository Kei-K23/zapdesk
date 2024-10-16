import type { EditorValue } from "@/components/editor";
import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef, useState } from "react";
import useCreateMessage from "../mutation/use-create-message";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useChannelId from "../hooks/use-channel-id";
import { useToast } from "@/hooks/use-toast";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export default function ChatInput({ placeholder }: ChatInputProps) {
  const [isPending, setIsPending] = useState(false);
  const [rerenderEditor, setRerenderEditor] = useState(0);
  const { toast } = useToast();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessageMutation } = useCreateMessage();

  const handleSubmit = async ({ image, body }: EditorValue) => {
    try {
      setIsPending(true);
      await createMessageMutation(
        {
          workspaceId,
          channelId,
          body,
        },
        {
          throwError: true,
        }
      );
      // Clear the editor by re-rendering the state
      setRerenderEditor((prev) => prev + 1);
    } catch (e) {
      toast({
        title: "Cannot sent message",
        description:
          "Something went wrong when sending message. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        rerenderEditor={rerenderEditor}
        disabled={isPending}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        innerRef={editorRef}
      />
    </div>
  );
}
