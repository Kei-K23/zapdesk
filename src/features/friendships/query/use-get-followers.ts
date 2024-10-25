import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function useGetFollowers({ userId }: { userId: Id<"users"> }) {
  const data = useQuery(api.friendships.getFollowers, { userId });
  const isLoading = data === undefined;

  return { data, isLoading };
}
