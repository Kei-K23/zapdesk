import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannelsAndMembers = ({ id }: { id: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getChannelsAndMembers, {
    workspaceId: id,
  });
  const isLoading = data === undefined;

  return { isLoading, data };
};
