import Sidebar from "@/components/sidebar";
import React from "react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row w-full h-full">
      <Sidebar />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
