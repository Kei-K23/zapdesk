import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../../convex/_generated/dataModel";
import { Trash2Icon } from "lucide-react";
import EditWorkspaceModal from "./edit-workspace-modal";
import useDeleteWorkspace from "@/features/workspaces/mutation/use-delete-workspace";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";

interface PreferencesWorkspaceModalProps {
  workspace: Doc<"workspaces">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PreferencesWorkspaceModal({
  workspace,
  open,
  setOpen,
}: PreferencesWorkspaceModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This process will delete permanently the workspace"
  );
  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId: workspace._id });

  const { mutate, isPending } = useDeleteWorkspace();

  const isLoading = isPending || currentMemberLoading;
  const isAdmin = currentMember?.role === "admin";
  const isModerator = currentMember?.role === "moderator";

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      {
        id: workspace._id,
      },
      {
        onSuccess: () => {
          handleClose();
          toast({
            title: "Successfully deleted the workspace",
          });
          router.replace("/");
        },
        onError: () => {
          toast({
            title: "Error when deleting workspace",
          });
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-black">
          <DialogHeader>
            <DialogTitle>{workspace.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 border px-4 py-2 bg-neutral-900 rounded-lg flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm">Workspace name</p>
              <p className="text-lg font-bold">{workspace.name}</p>
            </div>
            {(isModerator || isAdmin) && (
              <>
                <Button
                  disabled={isLoading}
                  size={"sm"}
                  variant={"transparent"}
                  onClick={() => setOpenEdit(true)}
                >
                  Edit
                </Button>
                <EditWorkspaceModal
                  id={workspace._id}
                  value={workspace.name}
                  open={openEdit}
                  setOpen={setOpenEdit}
                />
              </>
            )}
          </div>
          {isAdmin && (
            <Button
              disabled={isLoading}
              variant={"destructive"}
              onClick={handleOnDelete}
            >
              <Trash2Icon className="size-5 mr-2" /> Delete the workspace
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
