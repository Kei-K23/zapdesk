"use client";

import UserButton from "@/features/auth/components/user-button";
import React from "react";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-16 bg-neutral-900/80 flex flex-col items-center pt-4">
      <WorkspaceSwitcher />
      <div className="mt-4 space-y-4">
        <SidebarButton
          label="Home"
          icon={Home}
          isActive={pathname.includes("/workspaces")}
        />
        <SidebarButton label="DMS" icon={MessagesSquare} />
        <SidebarButton label="Activity" icon={Bell} />
        <SidebarButton label="More" icon={MoreHorizontal} />
      </div>
      <div className="mt-auto flex items-center mb-6">
        <UserButton />
      </div>
    </aside>
  );
}
