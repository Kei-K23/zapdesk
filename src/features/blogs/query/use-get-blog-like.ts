import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetBlogLike = (blogId: Id<"blogs">) => {
  const data = useQuery(api.blogLikes.getBlogLikeByBlogAndUserId, { blogId });
  const isLoading = data === undefined;

  return { isLoading, data };
};
