import { Dot, Users } from "lucide-react";
import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProfileFriendshipSectionProps {
  followers: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
  following: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
}

export default function ProfileFriendshipSection({
  followers,
  following,
}: ProfileFriendshipSectionProps) {
  return (
    <div className="mt-1 flex items-center gap-x-0.5 text-muted-foreground text-sm">
      <div className="flex items-center gap-x-0.5">
        <Users className="size-4 mr-1" />
        <div>
          <strong className="text-neutral-100 text-[16px]">
            {followers?.length}
          </strong>{" "}
          followers
        </div>
      </div>
      <div>
        <Dot className="size-5 text-neutral-100" />
      </div>
      <div>
        <strong className="text-neutral-100 text-[16px]">
          {following?.length}
        </strong>{" "}
        following
      </div>
    </div>
  );
}
