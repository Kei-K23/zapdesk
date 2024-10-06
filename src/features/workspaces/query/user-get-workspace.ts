import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspace = ({ id }: { id: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getWorkspaceById, { id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
