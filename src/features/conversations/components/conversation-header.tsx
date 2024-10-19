import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationHeaderProps {
  memberName: string | undefined;
  memberProfile: string | undefined;
  memberLoading: boolean;
}

export default function ConversationHeader({
  memberName,
  memberProfile,
  memberLoading,
}: ConversationHeaderProps) {
  const fallbackAvatar = memberName?.charAt(0).toUpperCase();

  return (
    <>
      <div className="bg-neutral-700/50 border-b border-b-neutral-600 shadow-md px-6 h-[50px] py-2 flex items-center justify-between">
        {memberLoading ? (
          <>
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </>
        ) : (
          <>
            <Avatar className="size-8 hover:opacity-75 transition-all mr-2 rounded-md">
              <AvatarImage src={memberProfile} alt={memberName} />
              <AvatarFallback className="text-white rounded-md text-[16px] bg-indigo-600 font-bold">
                {fallbackAvatar}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">{memberName}</span>
          </>
        )}
        <div className="flex-1" />
      </div>
    </>
  );
}
