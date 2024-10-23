"use client";

import { useGetWorkspaces } from "@/features/workspaces/query/user-get-workspaces";
import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/use-create-workspace-modal-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModalStore();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.push(`/workspaces/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return null;
}
