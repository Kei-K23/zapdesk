import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useGetMutualWorkspaces({
  userId,
}: {
  userId: Id<"users">;
}) {
  const data = useQuery(api.workspaces.getMutualWorkspaces, { userId });
  const isLoading = data === undefined;

  return { data, isLoading };
}
