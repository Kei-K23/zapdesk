import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../../convex/_generated/dataModel";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";
import useDeleteChannel from "@/features/channel/mutation/use-delete-channel";
import EditChannelModal from "./edit-channel-modal";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useGetCurrentMember from "@/features/workspaces/query/use-get-current-member";

interface PreferencesChannelModalProps {
  channel: Doc<"channels">;
  open: boolean;
  setOpen: (open: boolean) => void;
  channelLoading: boolean;
}

export default function PreferencesChannelModal({
  channel,
  open,
  channelLoading,
  setOpen,
}: PreferencesChannelModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [openEdit, setOpenEdit] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This process will permanently delete this channel and all related messages"
  );

  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember({ workspaceId });
  const { mutate, isPending } = useDeleteChannel();

  const isLoading = isPending || channelLoading || currentMemberLoading;
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
        id: channel?._id,
      },
      {
        onSuccess: () => {
          handleClose();
          toast({
            title: "Successfully deleted the channel",
          });
          router.replace("/");
        },
        onError: () => {
          toast({
            title: "Error when deleting channel",
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
            <DialogTitle>{channel?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 border px-4 py-2 bg-neutral-900 rounded-lg flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm">Channel name</p>
              <p className="text-lg font-bold">{channel?.name}</p>
            </div>

            {(isAdmin || isModerator) && (
              <>
                <Button
                  disabled={isLoading}
                  size={"sm"}
                  variant={"transparent"}
                  onClick={() => setOpenEdit(true)}
                >
                  Edit
                </Button>
                <EditChannelModal
                  id={channel?._id}
                  value={channel?.name}
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
              <Trash2Icon className="size-5 mr-2" /> Delete the channel
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
