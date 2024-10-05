"use client";

import UserButton from "@/features/auth/components/user-button";
import { useGetWorkspace } from "@/features/workspaces/query/user-get-workspace";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { data, isLoading } = useGetWorkspace();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to workspaceId");
    } else {
      console.log("workspace create modal");
    }
  }, [workspaceId, isLoading]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home page
      <UserButton />
    </main>
  );
}
