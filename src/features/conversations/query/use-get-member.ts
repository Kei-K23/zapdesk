import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetMember = (id: Id<"members">) => {
  const data = useQuery(api.member.getMemberById, { id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
