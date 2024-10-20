import React, { useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import ThreadHeader from "./thread-header";
import { useGetMessage } from "../query/use-get-message";
import MessageItem from "./message-item";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import Editor, { EditorValue } from "@/components/editor";
import Quill from "quill";
import useCreateMessage from "../mutation/use-create-message";
import useChannelId from "@/features/channel/hooks/use-channel-id";
import useGenerateImageUrl from "../mutation/use-generate-image-url";
import { useToast } from "@/hooks/use-toast";
import MessageList from "./message-list";
import { useGetMessages } from "../query/use-get-messages";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValue = {
  body: string;
  workspaceId: Id<"workspaces">;
  parentMessageId?: Id<"messages">;
  image?: Id<"_storage">;
  channelId?: Id<"channels">;
};

export default function Thread({ messageId, onClose }: ThreadProps) {
  const { toast } = useToast();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const editorRef = useRef<Quill | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const imageElementRef = useRef<HTMLInputElement | null>(null);
  const [rerenderEditor, setRerenderEditor] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: currentMemberData, isLoading: currentMemberDataLoading } =
    useGetCurrentMember({
      workspaceId,
    });
  const { data: threadMessage, isLoading: threadMessageLoading } =
    useGetMessage(messageId);

  const { mutate: createMessageMutation } = useCreateMessage();
  const { mutate: generateImageUrlMutation } = useGenerateImageUrl();
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const handleSubmit = async ({ image, body }: EditorValue) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const value: CreateMessageValue = {
        workspaceId,
        channelId,
        body,
        parentMessageId: messageId,
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
            imageElementRef.current!.value = "";
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

  const parentMessageItem = () => (
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
  );

  if (threadMessageLoading || currentMemberDataLoading) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span>Loading message...</span>
      </div>
    );
  }

  if (!threadMessage) {
    return (
      <div className="flex flex-col h-full">
        <ThreadHeader onClose={onClose} />
        <div className="flex-1 h-full flex flex-col justify-center items-center">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <span>No message found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ThreadHeader onClose={onClose} />
      <MessageList
        data={results}
        loadMore={loadMore}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore"}
        parentMessageItem={parentMessageItem}
        variant="thread"
      />
      <div className="px-5 w-full">
        <Editor
          image={image}
          setImage={setImage}
          rerenderEditor={rerenderEditor}
          disabled={isPending}
          onSubmit={handleSubmit}
          placeholder={"Write something"}
          innerRef={editorRef}
          imageRef={imageElementRef}
        />
      </div>
    </div>
  );
}
