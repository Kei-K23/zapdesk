import { CardDescription, CardTitle } from "@/components/ui/card";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  user: Doc<"users">;
}

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user?.image} alt={user?.name} />
        <AvatarFallback>
          {user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="text-center sm:text-left">
        <CardTitle className="text-2xl">{user?.name}</CardTitle>
        <CardDescription>{user?.role}</CardDescription>
      </div>
    </div>
  );
}
