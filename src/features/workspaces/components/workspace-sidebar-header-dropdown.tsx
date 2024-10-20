import React, { useState } from "react";
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
import PreferencesWorkspaceModal from "@/components/modals/preferences-workspace-modal";
import InviteNewMemberModal from "@/components/modals/invite-new-member-modal";

type WorkspaceSidebarHeaderDropdownProps = {
  workspace: Doc<"workspaces">;
  memberRole: "member" | "admin" | "moderator";
};

export default function WorkspaceSidebarHeaderDropdown({
  workspace,
  memberRole,
}: WorkspaceSidebarHeaderDropdownProps) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

  const isMember = memberRole === "member";

  return (
    <>
      <PreferencesWorkspaceModal
        workspace={workspace}
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
      />
      <InviteNewMemberModal
        workspace={workspace}
        open={inviteMemberOpen}
        setOpen={setInviteMemberOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <Button
            variant={"transp"}
            className="flex items-center gap-1 outline-none"
          >
            <span className="text-[16px] font-bold">{workspace?.name}</span>
            <ChevronDown className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" className="w-60 p-2">
          <div>
            <h2 className="font-bold line-clamp-1">{workspace?.name}</h2>
            <span className=" text-neutral-200 text-sm">Active workspace</span>
          </div>
          <Separator className="my-2" />
          {!isMember && (
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setInviteMemberOpen(true)}
            >
              <Send className="size-4" />
              <p className="font-semibold">Invite new member</p>
            </DropdownMenuItem>
          )}
          {!isMember && (
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setPreferencesOpen(true)}
            >
              <PaintbrushIcon className="size-4" />
              <p className="font-semibold">Preferences</p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
