import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserHoverCardProps {
  children: React.ReactNode;
  name: string;
  avatar?: string;
  workspaces?: {
    name: string;
    image?: string;
  };
}

export default function UserHoverCard({
  children,
  name,
  avatar,
  workspaces,
}: UserHoverCardProps) {
  const fallbackAvatar = name?.charAt(0)?.toUpperCase();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start">
          <Avatar className="size-10 hover:opacity-75 transition-all mr-2 rounded-md">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
              {fallbackAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-x-1">
            <span className={"text-lg font-semibold truncate"}>{name}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
