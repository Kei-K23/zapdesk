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

interface PreferencesChannelModalProps {
  channel: Doc<"channels">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PreferencesChannelModal({
  channel,
  open,
  setOpen,
}: PreferencesChannelModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This process will permanently delete this channel and all related messages"
  );

  const { mutate, isPending } = useDeleteChannel();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      {
        id: channel._id,
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{channel.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 border px-4 py-2 bg-neutral-900 rounded-lg flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm">Channel name</p>
              <p className="text-lg font-bold">{channel.name}</p>
            </div>
            <Button
              disabled={isPending}
              size={"sm"}
              variant={"transparent"}
              onClick={() => setOpenEdit(true)}
            >
              Edit
            </Button>
            <EditChannelModal
              id={channel._id}
              value={channel.name}
              open={openEdit}
              setOpen={setOpenEdit}
            />
          </div>
          <Button
            disabled={isPending}
            variant={"destructive"}
            onClick={handleOnDelete}
          >
            <Trash2Icon className="size-5 mr-2" /> Delete the channel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
