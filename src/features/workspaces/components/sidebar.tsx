"use client";

import UserButton from "@/features/auth/components/user-button";
import React from "react";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import { Home } from "lucide-react";
import { FaChalkboard } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <aside className="w-16 bg-neutral-900/50 border-r-[0.5px] border-r-neutral-800 flex flex-col items-center pt-4">
      <WorkspaceSwitcher />
      <div className="mt-4 space-y-4">
        <SidebarButton
          label="Home"
          icon={Home}
          isActive={pathname.includes("/workspaces")}
        />
        <SidebarButton
          label="Wb"
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
