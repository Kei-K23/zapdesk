import type { EditorValue } from "@/components/editor";
import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef, useState } from "react";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useChannelId from "../hooks/use-channel-id";
import { useToast } from "@/hooks/use-toast";
import useCreateMessage from "@/features/messages/mutation/use-create-message";
import useGenerateImageUrl from "@/features/messages/mutation/use-generate-image-url";
import { Id } from "../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValue = {
  body: string;
  workspaceId: Id<"workspaces">;
  parentMessageId?: Id<"messages">;
  image?: Id<"_storage">;
  channelId?: Id<"channels">;
};

export default function ChatInput({ placeholder }: ChatInputProps) {
  const [isPending, setIsPending] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [rerenderEditor, setRerenderEditor] = useState(0);
  const { toast } = useToast();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const editorRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  const { mutate: createMessageMutation } = useCreateMessage();
  const { mutate: generateImageUrlMutation } = useGenerateImageUrl();

  const handleSubmit = async ({ image, body }: EditorValue) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const value: CreateMessageValue = {
        workspaceId,
        channelId,
        body,
        image: undefined,
      };

      // Image upload here
      if (image) {
        const imageUploadUrl = await generateImageUrlMutation(
          {},
          {
            throwError: true,
          }
        );

        if (!imageUploadUrl) {
          throw new Error("Cannot upload image");
        }

        const result = await fetch(imageUploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        if (!storageId) {
          throw new Error("Failed to upload image");
        }
        value.image = storageId;
      }

      // Create the message
      await createMessageMutation(
        {
          ...value,
        },
        {
          onSuccess: () => {
            // Clear the editor by re-rendering the state
            setRerenderEditor((prev) => prev + 1);
            setImage(null);
          },
          onError: () => {
            throw new Error("Failed to send message");
          },
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast({
        title: e.message,
        description:
          "Something went wrong when sending message. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        image={image}
        setImage={setImage}
        rerenderEditor={rerenderEditor}
        disabled={isPending}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        innerRef={editorRef}
        imageRef={imageElementRef}
      />
    </div>
  );
}
