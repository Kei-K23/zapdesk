import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { useCurrentUser } from "../query/use-current-user";
import { Loader2, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function UserButton() {
  const { signOut } = useAuthActions();
  const { isLoading, data } = useCurrentUser();
  if (isLoading) {
    return <Loader2 className="size-5 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { image, name, email } = data;

  const fallbackAvatar = name?.charAt(0).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-10 hover:opacity-75 transition-all">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-black text-2xl">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
