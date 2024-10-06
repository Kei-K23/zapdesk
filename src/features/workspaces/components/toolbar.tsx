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
    <nav className="bg-[#481349] text-white flex items-center justify-between h-10 py-2 px-4">
      {/* Placeholder element */}
      <div className="flex-1" />
      <div className="min-w-[280px] w-[620px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent/35 w-full transition-all flex justify-start"
        >
          <Search className="size-4 mr-2" />
          <span className="font-bold">Search {data?.name}</span>
        </Button>
      </div>
      <div className="flex-1 flex justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <CircleAlert />
        </Button>
      </div>
    </nav>
  );
}
