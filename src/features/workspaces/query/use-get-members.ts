import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useGetMembers({
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
}) {
  const data = useQuery(api.member.getMembers, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
}
