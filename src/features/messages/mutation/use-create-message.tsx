import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  body: string;
  workspaceId: Id<"workspaces">;
  image?: Id<"_storage">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
  updatedAt?: number;
};
type ResponseType = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: Id<"messages">) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export default function useCreateMessage() {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isSuccess = useMemo(() => status === "success", [status]);
  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.messages.createMessage);

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
