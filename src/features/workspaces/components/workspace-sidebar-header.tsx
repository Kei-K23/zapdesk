import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import WorkspaceSidebarHeaderDropdown from "./workspace-sidebar-header-dropdown";
import { Button } from "@/components/ui/button";
import { Edit, Filter } from "lucide-react";

type WorkspaceSidebarHeaderProps = {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
};

export default function WorkspaceSidebarHeader({
  workspace,
  isAdmin,
}: WorkspaceSidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <WorkspaceSidebarHeaderDropdown workspace={workspace} isAdmin={isAdmin} />
      <div className="flex items-center gap-x-2">
        <Button variant={"transp"} size={"iconSm"}>
          <Filter className="size-4" />
        </Button>
        <Button variant={"transp"} size={"iconSm"}>
          <Edit className="size-4" />
        </Button>
      </div>
    </div>
  );
}
