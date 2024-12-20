import dynamic from "next/dynamic";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageThumbnail from "./message-thumbnail";
import MessageToolbar from "./message-toolbar";
import useUpdateMessage from "../mutation/use-update-message";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { EditorValue } from "@/components/editor";
import useDeleteMessage from "../mutation/use-delete-message";
import useConfirm from "@/hooks/use-confirm";
import useToggleReaction from "../mutation/use-toggle-reaction";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import ThreadBar from "./thread-bar";
import RoleIndicator from "@/components/role-indicator";
import useGetMutualWorkspaces from "@/features/workspaces/query/use-get-mutual-workspaces";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import UserPopoverCard from "@/components/user/user-popover-card";

const Renderer = dynamic(() => import("./renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const formatFulltime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

interface MessageItemProps {
  id?: Id<"messages">;
  memberId?: Id<"members">;
  userId: Id<"users">;
  role?: "admin" | "member" | "moderator";
  authorImage?: string;
  authorName?: string;
  authorBio?: string;
  currentAuthMember?: Doc<"members">;
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
  userId,
  authorImage,
  authorName = "Member",
  authorBio,
  role,
  currentAuthMember,
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
  const { toast } = useToast();
  const { onOpenMessage, parentMessageId, onClose } = usePanel();
  const { data: currentUser } = useCurrentUser();
  const { data: mutualWorkspaces } = useGetMutualWorkspaces({ userId });
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This process will permanently delete the message and cannot undo."
  );
  const fallbackAvatar = authorName.charAt(0).toUpperCase();
  const { mutate: updateMessageMutation, isPending: updateMessagePending } =
    useUpdateMessage();
  const { mutate: deleteMessageMutation, isPending: deleteMessagePending } =
    useDeleteMessage();
  const { mutate: toggleReactionMutation } = useToggleReaction();

  const isPending = updateMessagePending || deleteMessagePending;
  const currentAuthUser = currentUser?._id === userId;

  const handleUpdateMessage = ({ body, image }: EditorValue) => {
    updateMessageMutation(
      { id: id!, body },
      {
        onSuccess: () => {
          toast({ title: "Message updated" });
          setEditing(null);
        },
        onError: (e) => {
          toast({ title: "Error when updating the message" });
        },
      }
    );
  };

  const handleDeleteMessage = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMessageMutation(
      { id: id! },
      {
        onSuccess: (id) => {
          toast({ title: "Message deleted" });

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: (e) => {
          toast({ title: "Error when deleting the message" });
        },
      }
    );
  };

  const handleToggleReaction = async (value: string) => {
    if (!id) return;

    toggleReactionMutation(
      { messageId: id, value },
      {
        onError: (e) => {
          toast({ title: "Error when react to the message" });
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex items-start gap-3 px-1 py-2 transition-all group relative hover:bg-neutral-700/40",
            isEditing && "bg-indigo-700/40 hover:bg-indigo-700/40",
            deleteMessagePending &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div
            className={cn(
              "group-hover:opacity-100 opacity-0 items-start gap-2",
              isEditing && "opacity-0 group-hover:opacity-0"
            )}
          >
            <button className="w-14 text-[10px] text-muted-foreground">
              {format(new Date(createdAt!), "hh:mm a")}
            </button>
          </div>
          {isEditing ? (
            <div className="w-full">
              <Editor
                onSubmit={handleUpdateMessage}
                disabled={isPending}
                defaultValue={JSON.parse(body!)}
                onCancel={() => setEditing(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="mt-1 flex flex-col w-full">
              <Renderer value={body} />
              {image && <MessageThumbnail image={image} />}
              <Reactions
                data={reactions || []}
                onChange={handleToggleReaction}
              />
              <ThreadBar
                memberName={authorName}
                image={threadImage}
                count={threadCount}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id!)}
              />
              {updatedAt && (
                <span className="text-sm text-muted-foreground">(edited)</span>
              )}
            </div>
          )}

          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              isHideThreadButton={hideThreadButton}
              handleEdit={() => setEditing(id!)}
              handleDelete={handleDeleteMessage}
              handleReactions={handleToggleReaction}
              handleThread={() => onOpenMessage(id!)}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex items-start gap-x-1 px-5 py-2 transition-all group relative hover:bg-neutral-700/40",
          isEditing && "bg-indigo-700/40 hover:bg-indigo-700/40",
          deleteMessagePending &&
            "bg-rose-500/50 hover:bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300"
        )}
      >
        <UserPopoverCard
          bio={authorBio}
          userId={userId}
          name={authorName}
          authorId={memberId!}
          currentAuthMember={currentAuthMember}
          avatar={authorImage}
          workspaces={currentAuthUser ? [] : mutualWorkspaces}
          isCurrentAuthUser={currentAuthUser}
          authorRole={role}
        >
          <Avatar className="size-10 hover:opacity-75 transition-all mr-2 rounded-md cursor-pointer">
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback className="text-white rounded-md text-[16px] md:text-xl bg-indigo-600 font-bold">
              {fallbackAvatar}
            </AvatarFallback>
          </Avatar>
        </UserPopoverCard>
        {isEditing ? (
          <div className="w-full">
            <Editor
              onSubmit={handleUpdateMessage}
              disabled={isPending}
              defaultValue={JSON.parse(body!)}
              onCancel={() => setEditing(null)}
              variant="update"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-x-2">
              <UserPopoverCard
                bio={authorBio}
                userId={userId}
                name={authorName}
                avatar={authorImage}
                authorRole={role}
                workspaces={currentAuthUser ? [] : mutualWorkspaces}
                isCurrentAuthUser={currentAuthUser}
                authorId={memberId!}
                currentAuthMember={currentAuthMember}
              >
                <span className="text-[15px] md:text-[17px] truncate hover:underline cursor-pointer">
                  {authorName}
                </span>
              </UserPopoverCard>
              <RoleIndicator role={role!} />
              <Hint label={formatFulltime(new Date(createdAt!))}>
                <button className="text-sm text-muted-foreground">
                  {format(new Date(createdAt!), "hh:mm a")}
                </button>
              </Hint>
            </div>
            <div className="mt-1 flex flex-col w-full">
              <Renderer value={body} />
              {image && <MessageThumbnail image={image} />}
              <Reactions
                data={reactions || []}
                onChange={handleToggleReaction}
              />
              <ThreadBar
                memberName={authorName}
                image={threadImage}
                count={threadCount}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id!)}
              />
              {updatedAt && (
                <span className="text-sm text-muted-foreground">(edited)</span>
              )}
            </div>
          </div>
        )}

        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            isHideThreadButton={hideThreadButton}
            handleEdit={() => setEditing(id!)}
            handleDelete={handleDeleteMessage}
            handleReactions={handleToggleReaction}
            handleThread={() => onOpenMessage(id!)}
          />
        )}
      </div>
    </>
  );
}
