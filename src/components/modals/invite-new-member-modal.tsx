import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../../convex/_generated/dataModel";
import { Link, Recycle, Trash2Icon } from "lucide-react";
import EditWorkspaceModal from "./edit-workspace-modal";
import useDeleteWorkspace from "@/features/workspaces/mutation/use-delete-workspace";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";

interface InviteNewMemberModalProps {
  workspace: Doc<"workspaces">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function InviteNewMemberModal({
  workspace,
  open,
  setOpen,
}: InviteNewMemberModalProps) {
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();
  const router = useRouter();

  const handleCopy = () => {
    const invitationLink = `${window.location.origin}/join/${workspaceId}`;

    window.navigator.clipboard
      .writeText(invitationLink)
      .then(() => toast({ title: "Invitation link copy to clipboard" }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite new member to &apos;{workspace.name}&apos;
            </DialogTitle>
            <DialogDescription>
              Please use below invitation code to invite new member to this
              workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex items-center justify-center flex-col">
            <p className="text-center font-extrabold text-4xl mb-4">
              {workspace.joinCode.toUpperCase()}
            </p>
            <Button variant={"transparent"} onClick={handleCopy}>
              Copy link <Link className="ml-2 size-4" />
            </Button>
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-between gap-x-4">
              <Button variant={"transparent"}>
                New code <Recycle className="ml-2 size-4" />
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
