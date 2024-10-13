import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";
import useWorkspaceId from "../hooks/use-workspace-id";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
}

export default function SidebarItem({
  label,
  icon: Icon,
  id,
}: SidebarItemProps) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      asChild
      variant={"transp"}
      size={"sm"}
      className="flex justify-start"
    >
      <Link href={`/workspaces/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 mr-2" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
}
