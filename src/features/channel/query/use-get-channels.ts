import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannels = (id: Id<"workspaces">) => {
  const data = useQuery(api.channels.getChannels, { workspaceId: id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
