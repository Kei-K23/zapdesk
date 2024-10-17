import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/use-create-workspace-modal-store";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import useCreateWorkspace from "@/features/workspaces/mutation/use-create-workspace";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function CreateWorkspaceModal() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateWorkspaceModalStore();

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
          router.push(`/workspaces/${id}`);
          handleClose();
          toast({
            title: "Successfully created new workspace",
          });
        },
        onError: () => {
          toast({
            title: "Error when creating workspace",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
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
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
