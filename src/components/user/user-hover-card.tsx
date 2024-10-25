import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";

interface UserHoverCardProps {
  children: React.ReactNode;
  isCurrentAuthUser: boolean;
  name: string;
  avatar?: string;
  workspaces?: Doc<"workspaces">[];
}

export default function UserHoverCard({
  children,
  name,
  avatar,
  workspaces,
  isCurrentAuthUser,
}: UserHoverCardProps) {
  const fallbackAvatar = name?.charAt(0)?.toUpperCase();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start justify-between gap-x-4">
          <Avatar className="size-14 hover:opacity-75 transition-all mr-2 rounded-md">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-white rounded-md text-[16px] md:text-lg bg-indigo-600 font-bold">
              {fallbackAvatar}
            </AvatarFallback>
          </Avatar>
          {!isCurrentAuthUser && (
            <div className="flex items-center gap-x-1">
              <Button variant={"outline"} size={"sm"}>
                follow
              </Button>
              <Button variant={"outline"} size={"sm"}>
                <MoreVertical className="size-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-1 mt-2">
          <span className={"text-[16.5px] font-semibold truncate"}>{name}</span>
        </div>
        {/* TODO: Also show workspace server image */}
        {workspaces && workspaces?.length > 0 && (
          <div className="mt-3">
            <span className="text-muted-foreground text-sm">
              {workspaces.length} Mutual{" "}
              {workspaces.length > 1 ? "workspaces" : "workspace"}
            </span>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
