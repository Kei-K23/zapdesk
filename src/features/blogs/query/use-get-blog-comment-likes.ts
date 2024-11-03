import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetBlogCommentLikes = (
  blogId: Id<"blogs">,
  commentId: Id<"comments">
) => {
  const data = useQuery(api.blogCommentLikes.getCommentLikes, {
    blogId,
    commentId,
  });
  const isLoading = data === undefined;

  return { isLoading, data };
};
