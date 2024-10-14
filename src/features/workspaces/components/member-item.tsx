import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import useWorkspaceId from "../hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberItemProps {
  name: string;
  avatar: string;
  isAdmin: boolean;
  id: string;
}

export default function MemberItem({
  name,
  avatar,
  id,
  isAdmin,
}: MemberItemProps) {
  const workspaceId = useWorkspaceId();
  const fallbackAvatar = name.charAt(0).toUpperCase();

  return (
    <Button
      asChild
      variant={"transp"}
      size={"sm"}
      className="flex justify-start"
    >
      <Link href={`/workspaces/${workspaceId}/members/${id}`}>
        <Avatar className="size-6 hover:opacity-75 transition-all mr-2 rounded-md">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-white text-[16px] bg-indigo-700 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{name}</span>
      </Link>
    </Button>
  );
}
