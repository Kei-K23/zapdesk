import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannel = (id: Id<"channels">) => {
  const data = useQuery(api.channels.getChannel, { id });
  const isLoading = data === undefined;

  return { isLoading, data };
};
