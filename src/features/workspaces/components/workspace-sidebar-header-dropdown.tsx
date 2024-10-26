import React, { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DoorOpen, PaintbrushIcon, Send, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PreferencesWorkspaceModal from "@/components/modals/preferences-workspace-modal";
import InviteNewMemberModal from "@/components/modals/invite-new-member-modal";
import useDeleteMember from "../mutation/use-delete-member";
import useConfirm from "@/hooks/use-confirm";
import useGetCurrentMember from "../query/use-get-current-member";
import useWorkspaceId from "../hooks/use-workspace-id";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type WorkspaceSidebarHeaderDropdownProps = {
  workspace: Doc<"workspaces">;
  memberRole: "member" | "admin" | "moderator";
};

export default function WorkspaceSidebarHeaderDropdown({
  workspace,
  memberRole,
}: WorkspaceSidebarHeaderDropdownProps) {
  const { toast } = useToast();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId });

  const [LeaveMemberConfirmDialog, leaveMemberConfirm] = useConfirm(
    "Are your sure?",
    "You are leaving the workspace. This process cannot be undo."
  );
  const {
    mutate: deleteMemberMutation,
    isPending: deleteMemberMutationLoading,
  } = useDeleteMember();

  const isMember = memberRole === "member";
  const isPending = currentMemberLoading || deleteMemberMutationLoading;

  const handleLeaveMember = async () => {
    const ok = await leaveMemberConfirm();
    if (!ok) return;

    if (!currentMember || currentMember?.role === "admin") {
      return;
    }

    deleteMemberMutation(
      {
        workspaceId,
        memberId: currentMember._id,
      },
      {
        onSuccess: () => {
          toast({ title: "Successfully left the workspace" });

          // Redirect to workspace
          router.replace("/workspaces");
        },
        onError: () => {
          toast({
            title: "Error when leaving the workspace",
          });
        },
      }
    );
  };

  return (
    <>
      <LeaveMemberConfirmDialog />
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
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="outline-none">
          <Button
            variant={"transp"}
            className="flex items-center gap-1 outline-none transition-all"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="text-sm font-bold">{workspace?.name}</span>
            {isOpen ? (
              <X className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
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
              disabled={isPending}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setInviteMemberOpen(true)}
            >
              <Send className="size-4" />
              <p className="font-semibold">Invite new member</p>
            </DropdownMenuItem>
          )}
          {!isMember && (
            <DropdownMenuItem
              disabled={isPending}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setPreferencesOpen(true)}
            >
              <PaintbrushIcon className="size-4" />
              <p className="font-semibold">Preferences</p>
            </DropdownMenuItem>
          )}
          {currentMember?.role !== "admin" && (
            <DropdownMenuItem
              disabled={isPending}
              className="flex items-center gap-2 cursor-pointer bg-destructive focus:bg-destructive/90"
              onClick={handleLeaveMember}
            >
              <DoorOpen className="size-4" />
              <p className="font-semibold">Leave server</p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
