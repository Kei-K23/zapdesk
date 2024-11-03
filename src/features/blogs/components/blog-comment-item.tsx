import Hint from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import MessageThumbnail from "@/features/messages/components/message-thumbnail";
import MessageToolbar from "@/features/messages/components/message-toolbar";
import useConfirm from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import React from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

const Renderer = dynamic(
  () => import("@/features/messages/components/renderer"),
  { ssr: false }
);
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const formatFulltime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

interface BlogCommentItemProps {
  id?: Id<"comments">;
  userId: Id<"users">;
  authorImage?: string;
  authorName?: string;
  authorBio?: string;
  body?: Doc<"comments">["body"];
  image?: string | undefined | null;
  isAuthor: boolean;
  isEditing: boolean;
  updatedAt: Doc<"comments">["updatedAt"];
  createdAt?: Doc<"comments">["_creationTime"];
  setEditing: (id: Id<"comments"> | null) => void;
}

export default function BlogCommentItem({
  id,
  userId,
  authorBio,
  body,
  image,
  isAuthor,
  isEditing,
  updatedAt,
  createdAt,
  authorName,
  authorImage,
  setEditing,
}: BlogCommentItemProps) {
  const { toast } = useToast();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This process will permanently delete the comment and cannot undo."
  );

  const fallbackAvatar = authorName?.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex items-start gap-x-1 px-5 py-2 transition-all group relative hover:bg-neutral-700/40",
          isEditing && "bg-indigo-700/40 hover:bg-indigo-700/40",
          false &&
            "bg-rose-500/50 hover:bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300"
        )}
      >
        <Avatar className="size-10 hover:opacity-75 transition-all mr-2 rounded-md cursor-pointer">
          <AvatarImage src={authorImage} alt={authorName} />
          <AvatarFallback className="text-white rounded-md text-[16px] md:text-xl bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
        {isEditing ? (
          <div className="w-full">
            <Editor
              onSubmit={() => {}}
              disabled={false}
              defaultValue={JSON.parse(body!)}
              onCancel={() => setEditing(null)}
              variant="update"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-x-2">
              <span className="text-[15px] md:text-[17px] truncate hover:underline cursor-pointer">
                {authorName}
              </span>

              <Hint label={formatFulltime(new Date(createdAt!))}>
                <button className="text-sm text-muted-foreground">
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
        )}

        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={false}
            isHideThreadButton={false}
            handleEdit={() => setEditing(id!)}
            handleDelete={() => {}}
            handleReactions={() => {}}
            handleThread={() => {}}
          />
        )}
      </div>
    </>
  );
}