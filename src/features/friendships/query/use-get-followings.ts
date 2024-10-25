import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useGetFollowings({ userId }: { userId: Id<"users"> }) {
  const data = useQuery(api.friendships.getFollowings, { userId });
  const isLoading = data === undefined;

  return { data, isLoading };
}
