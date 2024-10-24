"use client";

import { useCurrentUser } from "@/features/auth/query/use-current-user";
import { useGetWorkspaces } from "@/features/workspaces/query/user-get-workspaces";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspacePage() {
  const router = useRouter();
  const { data: userData, isLoading: userDataLoading } = useCurrentUser();
  const { data: workspacesData, isLoading: workspacesDataLoading } =
    useGetWorkspaces();

  useEffect(() => {
    if (
      !userData ||
      !workspacesData ||
      workspacesDataLoading ||
      userDataLoading
    ) {
      return;
    }

    if (!userData) {
      router.replace(`/auth`);
      return;
    }

    if (
      userData &&
      workspacesData[0] &&
      workspacesData[0].userId === userData._id
    ) {
      router.replace(`/workspaces/${workspacesData[0]._id}`);
      return;
    }
  }, [
    router,
    userData,
    userDataLoading,
    workspacesData,
    workspacesDataLoading,
  ]);

  if (workspacesDataLoading || userDataLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 mr-2 animate-spin" />
        Loading the workspace...
      </div>
    );
  }
}
