import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import useWorkspaceId from "../hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RoleIndicator from "@/components/role-indicator";
import { cn } from "@/lib/utils";

interface MemberItemProps {
  name: string;
  avatar: string;
  role: "admin" | "member" | "moderator";
  id: string;
  isActive: boolean;
}

export default function MemberItem({
  name,
  avatar,
  id,
  role,
  isActive,
}: MemberItemProps) {
  const workspaceId = useWorkspaceId();
  const fallbackAvatar = name.charAt(0).toUpperCase();

  return (
    <Button
      asChild
      variant={isActive ? "primary" : "transp"}
      size={"sm"}
      className="flex justify-start py-4"
    >
      <Link href={`/workspaces/${workspaceId}/members/${id}`}>
        <Avatar className="size-7 hover:opacity-75 transition-all mr-2 rounded-md">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-x-1">
          <span
            className={cn("text-[16px] truncate", isActive && "font-semibold")}
          >
            {name}
          </span>
          <RoleIndicator role={role} />
        </div>
      </Link>
    </Button>
  );
}
