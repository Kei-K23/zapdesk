import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import useCreateWorkspace from "@/features/workspaces/mutation/use-create-workspace";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateChannelModalStore } from "@/features/channel/store/use-create-channel-modal-store";

export default function CreateChannelModal() {
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateChannelModalStore();

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    mutate(
      {
        name: name.trim(),
      },
      {
        onSuccess: (id) => {
          // TODO: Redirect to newly created channel
          handleClose();
          toast({
            title: "Successfully created new channel",
          });
        },
        onError: () => {
          toast({
            title: "Error when creating channel",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
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
            onChange={(e) => setName(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
