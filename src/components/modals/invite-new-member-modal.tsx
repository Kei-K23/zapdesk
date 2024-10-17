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
import { Link, Recycle } from "lucide-react";
import useConfirm from "@/hooks/use-confirm";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useUpdateJoinCode from "@/features/workspaces/mutation/use-update-join-code";

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

  const [UpdateJoinCodeConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This process will deactivate the current join code and generate new join code for father joining to this workspace."
  );
  const { mutate, isPending } = useUpdateJoinCode();

  const handleCopy = () => {
    const invitationLink = `${window.location.origin}/join/${workspaceId}/join-code/${workspace.joinCode}`;

    window.navigator.clipboard
      .writeText(invitationLink)
      .then(() => toast({ title: "Invitation link copy to clipboard" }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnUpdateJoinCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast({
            title: "Successfully generated new join code",
          });
        },
        onError: () => {
          toast({
            title: "Error generating new join code",
          });
        },
      }
    );
  };

  return (
    <>
      <UpdateJoinCodeConfirmDialog />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-black">
          <DialogHeader>
            <DialogTitle>
              Invite people to &apos;{workspace.name}&apos;
            </DialogTitle>
            <DialogDescription>
              Please use below invitation code to invite people to this
              workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex items-center justify-center flex-col">
            <p className="text-center font-extrabold text-4xl mb-4">
              {workspace.joinCode.toUpperCase()}
            </p>
            <Button
              disabled={isPending}
              variant={"transparent"}
              onClick={handleCopy}
            >
              Copy link <Link className="ml-2 size-4" />
            </Button>
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-between gap-x-4">
              <Button
                disabled={isPending}
                variant={"transparent"}
                onClick={handleOnUpdateJoinCode}
              >
                New code <Recycle className="ml-2 size-4" />
              </Button>
              <DialogClose disabled={isPending} asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
