import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"users">;
  name?: string;
  image?: string;
  isPublishEmail?: boolean;
  bio?: string;
  role?: string;
  githubLink?: string;
  personalLink?: string;
  twitterLink?: string;
  youTubeLink?: string;
  igLink?: string;
  phone?: string;
};
type ResponseType = Id<"users"> | null;

type Options = {
  onSuccess?: (data: Id<"users"> | null) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export default function useUpdateUserProfile() {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isSuccess = useMemo(() => status === "success", [status]);
  const isPending = useMemo(() => status === "pending", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.users.updateUser);

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
