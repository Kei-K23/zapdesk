import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../../convex/_generated/dataModel";
import { Trash2Icon } from "lucide-react";

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
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{workspace.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 border px-4 py-2 bg-neutral-900 rounded-lg flex items-center justify-between">
          <div>
            <p className="mb-1">Workspace name</p>
            <p className="text-lg font-bold">{workspace.name}</p>
          </div>
          <Button variant={"transparent"}>Edit</Button>
        </div>
        <Button variant={"destructive"}>
          <Trash2Icon className="size-5 mr-2" /> Delete the workspace
        </Button>
      </DialogContent>
    </Dialog>
  );
}
