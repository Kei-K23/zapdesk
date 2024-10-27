import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useGetRelationship({
  userOneId,
  userTwoId,
}: {
  userOneId?: Id<"users">;
  userTwoId: Id<"users">;
}) {
  const data = useQuery(api.friendships.getRelationship, {
    userOneId,
    userTwoId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
}
