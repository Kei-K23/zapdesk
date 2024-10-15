import { Input } from "../ui/input";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Id } from "../../../convex/_generated/dataModel";
import useUpdateChannel from "@/features/channel/mutation/use-update-channel";

interface EditChannelModalProps {
  id: Id<"channels">;
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function EditChannelModal({
  id,
  value,
  open,
  setOpen,
}: EditChannelModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState<string>(value);

  const { mutate, isPending } = useUpdateChannel();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    mutate(
      {
        id,
        name: name.trim(),
      },
      {
        onSuccess: () => {
          handleClose();
          toast({
            title: "Successfully update the channel",
          });
        },
        onError: () => {
          toast({
            title: "Error when updating channel",
          });
        },
      }
    );
  };

  useEffect(() => {
    setName(value);
  }, [value]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Update &apos;{value}&apos; channel</DialogTitle>
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
            <Button disabled={isPending}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
