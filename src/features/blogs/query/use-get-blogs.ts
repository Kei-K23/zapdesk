import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetBlogs = () => {
  const data = useQuery(api.blogs.getBlogs);
  const isLoading = data === undefined;

  return { isLoading, data };
};
