import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetBlogs = (searchQuery?: string) => {
  const data = useQuery(api.blogs.getBlogs, { searchQuery });
  const isLoading = data === undefined;

  return { isLoading, data };
};
