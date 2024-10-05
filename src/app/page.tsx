"use client";

import UserButton from "@/features/auth/components/user-button";
import { useGetWorkspace } from "@/features/workspaces/query/user-get-workspace";
import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/use-create-workspace-modal-store";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { data, isLoading } = useGetWorkspace();
  const [open, setOpen] = useCreateWorkspaceModalStore();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to workspaceId");
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home page
      <UserButton />
    </main>
  );
}
