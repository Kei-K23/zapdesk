import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PaintbrushIcon, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type WorkspaceSidebarHeaderDropdownProps = {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
};

export default function WorkspaceSidebarHeaderDropdown({
  workspace,
  isAdmin,
}: WorkspaceSidebarHeaderDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        <Button
          variant={"transp"}
          className="flex items-center gap-1 outline-none"
        >
          <span className="text-lg font-bold">{workspace?.name}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="w-60 p-2">
        <div>
          <h2 className="font-bold line-clamp-1">{workspace?.name}</h2>
          <span className=" text-gray-500 text-sm">Active workspace</span>
        </div>
        <Separator className="my-2" />
        {isAdmin && (
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Send className="size-5" />
            <p className="font-semibold">Invite new member</p>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <PaintbrushIcon className="size-5" />
          <p className="font-semibold">Preferences</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
