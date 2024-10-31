import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetBlog = (id: Id<"blogs">) => {
  const data = useQuery(api.blogs.getBlogById, { id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
