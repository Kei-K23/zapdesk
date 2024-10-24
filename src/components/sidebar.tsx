"use client";

import UserButton from "@/features/auth/components/user-button";
import React, { useMemo } from "react";
import WorkspaceSwitcher from "../features/workspaces/components/workspace-switcher";
import SidebarButton from "../features/workspaces/components/sidebar-button";
import { Home } from "lucide-react";
import { FaChalkboard } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Hint from "@/components/hint";
import { useGetWorkspaces } from "../features/workspaces/query/user-get-workspaces";
import { Button } from "./ui/button";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  const isWorkspaces = pathname.includes("/workspaces");

  return (
    <aside className="w-16 bg-neutral-900/50 border-r-[0.5px] border-r-neutral-800 flex flex-col items-center pt-4 h-full">
      {isWorkspaces ? (
        <div>
          <WorkspaceSwitcher />
        </div>
      ) : (
        <Button
          size={"sm"}
          variant={"transparent"}
          className="font-[500] h-10 opacity-0 cursor-default"
        ></Button>
      )}
      <div className="mt-4 space-y-4">
        <Hint label="Workspaces">
          <SidebarButton
            label="WS"
            icon={Home}
            isActive={isWorkspaces}
            handleClick={() => router.push(`/workspaces/${workspaceId}`)}
          />
        </Hint>
        <Hint label="Home">
          <SidebarButton
            label="Home"
            icon={Home}
            isActive={pathname === "/"}
            handleClick={() => router.push(`/`)}
          />
        </Hint>
        <Hint label="Collaborative Whiteboard">
          <SidebarButton
            label="WB"
            icon={FaChalkboard}
            handleClick={() => router.replace("/whiteboard")}
          />
        </Hint>
      </div>
      <div className="mt-auto flex items-center mb-6">
        <UserButton />
      </div>
    </aside>
  );
}
