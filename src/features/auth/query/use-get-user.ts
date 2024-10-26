import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetUser = (id: Id<"users">) => {
  const data = useQuery(api.users.getUserById, { id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
