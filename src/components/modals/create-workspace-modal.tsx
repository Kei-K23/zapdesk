import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/use-create-workspace-modal-store";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

export default function CreateWorkspaceModal() {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateWorkspaceModalStore();

  const handelClose = () => {
    setOpen(false);
    // Handle form clean up
  };

  return (
    <Dialog open={open} onOpenChange={handelClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form>
          <Input
            disabled={false}
            placeholder="Workspace name e.g 'Personal', 'Work', 'School'"
            required
            value={name}
            minLength={3}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <Button>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
