import { Input } from "../ui/input";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useUpdateWorkspace from "@/features/workspaces/mutation/use-update-workspace";
import { Id } from "../../../convex/_generated/dataModel";

interface EditWorkspaceModalProps {
  id: Id<"workspaces">;
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function EditWorkspaceModal({
  id,
  value,
  open,
  setOpen,
}: EditWorkspaceModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState<string>(value);

  const { mutate, isPending } = useUpdateWorkspace();

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
            title: "Successfully update the workspace",
          });
        },
        onError: () => {
          toast({
            title: "Error when updating workspace",
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
          <DialogTitle>Update &apos;{value}&apos; workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            placeholder="Workspace name e.g 'Personal', 'Work', 'School'"
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
