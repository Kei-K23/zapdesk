import { CardDescription, CardTitle } from "@/components/ui/card";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileAvatarProps {
  user: Doc<"users">;
}

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user?.image} alt={user?.name} />
        <AvatarFallback className="text-3xl font-semibold">
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

export const ProfileAvatarSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
    <Avatar className="w-24 h-24">
      <Skeleton className="w-full h-full rounded-full" />
    </Avatar>
    <div className="text-center sm:text-left">
      <Skeleton className="w-60 h-4 mb-2" />
      <Skeleton className="w-52 h-4" />
    </div>
  </div>
);
