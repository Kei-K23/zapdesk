"use client";

import UserButton from "@/features/auth/components/user-button";
import React, { useMemo } from "react";
import SidebarButton from "../features/workspaces/components/sidebar-button";
import { Home, Pen } from "lucide-react";
import { FaChalkboard } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Hint from "@/components/hint";
import { useGetWorkspaces } from "../features/workspaces/query/user-get-workspaces";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  const isWorkspaces = pathname.includes("/workspaces");

  return (
    <aside className="w-16 bg-neutral-900/50 border-r-[0.5px] border-r-neutral-800 flex flex-col items-center pt-5 h-full">
      <div className="mt-4 space-y-4">
        <SidebarButton
          label="Home"
          hintLabel="Home"
          icon={Home}
          isActive={pathname === "/profile"}
          handleClick={() => router.push(`/profile`)}
        />
        <SidebarButton
          label="WS"
          hintLabel="Workspaces"
          icon={Home}
          isActive={isWorkspaces}
          handleClick={() => router.push(`/workspaces/${workspaceId}`)}
        />
        <SidebarButton
          label="Blog"
          hintLabel="Blog Posts"
          icon={Pen}
          isActive={pathname === "/blog-posts"}
          handleClick={() => router.push(`/blog-posts`)}
        />
        <SidebarButton
          label="WB"
          hintLabel="Whiteboard"
          icon={FaChalkboard}
          handleClick={() => router.replace("/whiteboard")}
        />
      </div>
      <div className="mt-auto flex items-center mb-6">
        <UserButton />
      </div>
    </aside>
  );
}
