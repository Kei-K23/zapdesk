import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.getWorkspace);
  const isLoading = data === undefined;

  return { isLoading, data };
};
