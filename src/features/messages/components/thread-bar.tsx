import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  memberName: string;
  image: string | undefined;
  count: number | undefined;
  timestamp: number | undefined;
  onClick: () => void;
}

export default function ThreadBar({
  memberName,
  image,
  count,
  timestamp,
  onClick,
}: ThreadBarProps) {
  const fallbackAvatar = memberName.charAt(0).toUpperCase();

  if (!count || !timestamp) return null;

  return (
    <div
      className="mt-2 group/thread-bar transition-all bg-neutral-600/70 px-2 py-1 rounded-md flex items-center gap-x-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        <Avatar className="size-6 hover:opacity-75 transition-all mr-2 rounded-md">
          <AvatarImage src={image} alt={memberName} />
          <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
            {fallbackAvatar}
          </AvatarFallback>
        </Avatar>
        <span className="text-[13.5px] font-semibold text-sky-500">
          {count > 1 ? `${count} replies` : `${count} reply`}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[13.5px] text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-[13.5px] text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}
