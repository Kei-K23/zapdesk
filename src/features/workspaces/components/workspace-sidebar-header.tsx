import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import WorkspaceSidebarHeaderDropdown from "./workspace-sidebar-header-dropdown";
import { Button } from "@/components/ui/button";
import { Edit, Filter } from "lucide-react";
import Hint from "@/components/hint";

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
        <Hint label="Filter conversations" side="bottom">
          <Button variant={"transp"} size={"iconSm"}>
            <Filter className="size-4" />
          </Button>
        </Hint>
        <Hint label="New message" side="bottom">
          <Button variant={"transp"} size={"iconSm"}>
            <Edit className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
}
