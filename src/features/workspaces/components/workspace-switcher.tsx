import React from "react";
import useWorkspaceId from "../hooks/use-workspace-id";
import { useGetWorkspace } from "../query/user-get-workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useGetWorkspaces } from "../query/user-get-workspaces";
import { Separator } from "@/components/ui/separator";
import { useCreateWorkspaceModalStore } from "../store/use-create-workspace-modal-store";
import { useRouter } from "next/navigation";

export default function WorkspaceSwitcher() {
  const router = useRouter();
  const [_open, setOpen] = useCreateWorkspaceModalStore();
  const workspaceId = useWorkspaceId();
  const { data: currentWorkspace } = useGetWorkspace({ id: workspaceId });
  const { data: workspaces } = useGetWorkspaces();

  const filteredWorkspaces =
    workspaces?.filter((w) => w?._id !== currentWorkspace?._id) ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" asChild>
        <Button variant={"secondary"} className="text-lg font-bold h-10">
          {currentWorkspace ? (
            currentWorkspace?.name.charAt(0).toUpperCase()
          ) : (
            <Loader2 className="size-4 animate-spin" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom" className="w-60 p-2">
        <div>
          <h2 className="font-bold line-clamp-1">{currentWorkspace?.name}</h2>
          <span className=" text-gray-500 text-sm">Active workspace</span>
        </div>
        <Separator className="my-2" />
        {filteredWorkspaces?.length > 0 ? (
          filteredWorkspaces?.map((w) => (
            <DropdownMenuItem
              key={w._id}
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => router.push(`/workspaces/${w?._id}`)}
            >
              <Button
                className="bg-gray-700/70 group-hover:bg-gray-700/80 hover:bg-gray-700/80 text-lg font-bold h-9"
                size={"sm"}
              >
                {w?.name.charAt(0).toUpperCase()}
              </Button>
              <p className="text-[16px] font-[500] line-clamp-1">{w?.name}</p>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No other workspace</p>
        )}
        <Separator className="my-2" />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-5" />
          <p>Crate new workspace</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
