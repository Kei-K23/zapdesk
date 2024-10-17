import { Input } from "../ui/input";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateChannelModalStore } from "@/features/channel/store/use-create-channel-modal-store";
import useCreateChannel from "@/features/channel/mutation/use-create-channel";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";

export default function CreateChannelModal() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateChannelModalStore();

  const { mutate, isPending } = useCreateChannel();

  const handelOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    mutate(
      {
        name: name.trim(),
        workspaceId,
      },
      {
        onSuccess: (id) => {
          handleClose();
          toast({
            title: "Successfully created new channel",
          });
          router.replace(`/workspaces/${workspaceId}/channels/${id}`);
        },
        onError: (e) => {
          toast({
            title: "Error when creating channel",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Add new channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            placeholder="e.g budget-plan, study-channel"
            required
            value={name}
            minLength={3}
            maxLength={80}
            onChange={handelOnChange}
          />
          <div className="mt-4 flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
