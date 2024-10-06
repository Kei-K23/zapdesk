"use client";

import UserButton from "@/features/auth/components/user-button";
import React from "react";
import WorkspaceSwitcher from "./workspace-switcher";

export default function Sidebar() {
  return (
    <aside className="w-16 bg-[#481349] flex flex-col items-center pt-4">
      <div>
        <WorkspaceSwitcher />
      </div>
      <div className="mt-auto flex items-center mb-6">
        <UserButton />
      </div>
    </aside>
  );
}
