import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";
import useWorkspaceId from "../hooks/use-workspace-id";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  isActive?: boolean;
}

export default function SidebarItem({
  label,
  icon: Icon,
  id,
  isActive,
}: SidebarItemProps) {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      asChild
      variant={isActive ? "primary" : "transp"}
      size={"sm"}
      className={cn("flex justify-start")}
    >
      <Link href={`/workspaces/${workspaceId}/channels/${id}`}>
        <Icon className="size-4 mr-2" />
        <span className={cn("text-sm truncate", isActive && "font-semibold")}>
          {label}
        </span>
      </Link>
    </Button>
  );
}
