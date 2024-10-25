import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { userOneId: Id<"users">; userTwoId: Id<"users"> };
type ResponseType = Id<"friendships"> | null;

type Options = {
  onSuccess?: (data: Id<"friendships"> | null) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export default function useRemoveFriendship() {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isSuccess = useMemo(() => status === "success", [status]);
  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.friendships.remove);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        setStatus("success");
      } catch (error) {
        setError(error as Error);

        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");

        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    data,
    isPending,
    isError,
    isSuccess,
    isSettled,
    error,
    status,
    mutate,
  };
}
