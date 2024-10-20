import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MemberProfilePanelHeader from "./member-profile-panel-header";

interface MemberProfilePanelProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export default function MemberProfilePanel({
  memberId,
  onClose,
}: MemberProfilePanelProps) {
  const { toast } = useToast();

  return (
    <div className="flex flex-col h-full">
      <MemberProfilePanelHeader onClose={onClose} />
      {/* <div className="flex-1 h-full flex flex-col justify-center items-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span>Loading the message</span>
      </div> */}
      {memberId}
    </div>
  );
}
