import Hint from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageThumbnail from "@/features/messages/components/message-thumbnail";
import useConfirm from "@/hooks/use-confirm";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import React from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { EditorValue } from "@/components/editor";
import useUpdateBlogComment from "../mutation/use-update-blog-comment";
import useDeleteBlogComment from "../mutation/use-delete-blog-comment";
import { Button } from "@/components/ui/button";
import { Flame, Plus } from "lucide-react";
import { useGetBlogCommentLike } from "../query/use-get-blog-comment-like";
import { useGetBlogCommentLikes } from "../query/use-get-blog-comment-likes";
import useCreateBlogCommentLike from "../mutation/use-create-blog-comment-like";
import useDeleteBlogCommentLike from "../mutation/use-delete-blog-comment-like";
import BlogCommentItemToolbar from "./blog-comment-item-toolbar";

const Renderer = dynamic(
  () => import("@/features/messages/components/renderer"),
  { ssr: false }
);
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const formatFulltime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

interface BlogCommentItemProps {
  id: Id<"comments">;
  blogId: Id<"blogs">;
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
  blogId,
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

  const {
    mutate: updateCommentMutation,
    isPending: updateCommentMutationLoading,
  } = useUpdateBlogComment();
  const {
    mutate: deleteCommentMutation,
    isPending: deleteCommentMutationLoading,
  } = useDeleteBlogComment();

  const fallbackAvatar = authorName?.charAt(0).toUpperCase();
  const mutationLoading =
    updateCommentMutationLoading || deleteCommentMutationLoading;

  const handleUpdateComment = ({ body, image }: EditorValue) => {
    updateCommentMutation(
      { id: id!, body, blogId: blogId! },
      {
        onSuccess: () => {
          toast({ title: "Comment updated" });
          setEditing(null);
        },
        onError: () => {
          toast({ title: "Error when updating the comment" });
        },
      }
    );
  };

  const handleDeleteMessage = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteCommentMutation(
      { id: id! },
      {
        onSuccess: () => {
          toast({ title: "Comment deleted" });
        },
        onError: () => {
          toast({ title: "Error when deleting the comment" });
        },
      }
    );
  };

  const {
    data: blogCommentLikeDataForCurrentUser,
    isLoading: blogCommentLikeDataForCurrentUserLoading,
  } = useGetBlogCommentLike(blogId, id);
  const { data: blogCommentLikesData, isLoading: blogCommentLikesDataLoading } =
    useGetBlogCommentLikes(blogId, id);

  const {
    mutate: createBlogCommentLikeMutation,
    isPending: createBlogCommentLikeMutationLoading,
  } = useCreateBlogCommentLike();

  const {
    mutate: deleteBlogCommentLikeMutation,
    isPending: deleteBlogCommentLikeMutationLoading,
  } = useDeleteBlogCommentLike();

  const isLoading =
    blogCommentLikeDataForCurrentUserLoading || blogCommentLikesDataLoading;

  const isPending =
    createBlogCommentLikeMutationLoading ||
    deleteBlogCommentLikeMutationLoading;

  const handelToggleLike = () => {
    if (!id || !blogId) return;

    if (!!blogCommentLikeDataForCurrentUser) {
      // Delete the blog comment like
      deleteBlogCommentLikeMutation(
        {
          blogId: blogId,
          id: blogCommentLikeDataForCurrentUser._id,
          commentId: id,
        },
        {
          onError: () => {
            toast({ title: "Error when removing the like" });
          },
        }
      );
    } else {
      // Create new blog comment like for the current user
      createBlogCommentLikeMutation(
        {
          blogId: blogId,
          commentId: id,
        },
        {
          onError: () => {
            toast({ title: "Error when creating the like" });
          },
        }
      );
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex items-start gap-x-1 px-5 py-2 transition-all group relative hover:bg-neutral-700/40",
          isEditing && "bg-indigo-700/40 hover:bg-indigo-700/40",
          deleteCommentMutationLoading &&
            "bg-rose-500/50 hover:bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-300"
        )}
      >
        <Avatar className="size-14 hover:opacity-75 transition-all mr-2 rounded-md cursor-pointer">
          <AvatarImage src={authorImage} alt={authorName} />
          <AvatarFallback className="text-white rounded-md text-[16px] md:text-xl bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
        {isEditing ? (
          <div className="w-full">
            <Editor
              onSubmit={handleUpdateComment}
              disabled={mutationLoading}
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
              <Hint label="Likes">
                <div
                  className={cn(
                    "w-16 flex items-center mt-5 cursor-pointer",
                    (isPending || isLoading) && "pointer-events-none opacity-70"
                  )}
                  onClick={handelToggleLike}
                >
                  <svg width="0" height="0">
                    <linearGradient
                      id="flame-gradient"
                      x1="100%"
                      y1="100%"
                      x2="0%"
                      y2="0%"
                    >
                      <stop stopColor="#ff0000" offset="0%" />
                      <stop stopColor="#fdcf58" offset="100%" />
                    </linearGradient>
                  </svg>
                  <Flame
                    style={{
                      stroke: !!blogCommentLikeDataForCurrentUser
                        ? "url(#flame-gradient)"
                        : "",
                    }}
                    className="size-5"
                  />{" "}
                  {blogCommentLikesData?.length &&
                  blogCommentLikesData?.length > 0 ? (
                    <span>{blogCommentLikesData?.length}</span>
                  ) : null}
                  {!!blogCommentLikeDataForCurrentUser && (
                    <Plus className="size-3" />
                  )}
                </div>
              </Hint>
              {updatedAt && (
                <span className="text-sm text-muted-foreground">(edited)</span>
              )}
            </div>
          </div>
        )}

        {!isEditing && (
          <BlogCommentItemToolbar
            isAuthor={isAuthor}
            isPending={mutationLoading}
            isHideThreadButton={false}
            handleEdit={() => setEditing(id!)}
            handleDelete={handleDeleteMessage}
            handleThread={() => {}}
          />
        )}
      </div>
    </>
  );
}
