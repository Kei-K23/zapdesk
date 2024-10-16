"use client";

import { Button } from "@/components/ui/button";
import { CircleAlert, Search } from "lucide-react";
import React from "react";
import useWorkspaceId from "../hooks/use-workspace-id";
import { useGetWorkspace } from "../query/user-get-workspace";

export default function Toolbar() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <nav className="bg-neutral-900/50 text-white flex items-center justify-between h-10 py-2 px-4 border-b border-b-neutral-800">
      {/* Placeholder element */}
      <div className="flex-1" />
      <div className="min-w-[280px] w-[620px] grow-[2] shrink">
        <Button
          size={"sm"}
          variant={"transparent"}
          className="w-full transition-all flex justify-start"
        >
          <Search className="size-4 mr-2" />
          <span className="font-bold line-clamp-1">Search {data?.name}</span>
        </Button>
      </div>
      <div className="flex-1 flex justify-end">
        <Button variant={"transp"} size={"iconSm"}>
          <CircleAlert className="size-5" />
        </Button>
      </div>
    </nav>
  );
}
