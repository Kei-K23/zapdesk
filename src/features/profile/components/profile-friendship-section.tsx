import { Dot, Users } from "lucide-react";
import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProfileFriendshipSectionProps {
  followers: Doc<"users">[];
  following: Doc<"users">[];
}

export default function ProfileFriendshipSection() {
  return (
    <div className="mt-1 flex items-center gap-x-0.5 text-muted-foreground text-sm">
      <div className="flex items-center gap-x-0.5">
        <Users className="size-4 mr-1" />
        <div>
          <strong className="text-neutral-100 text-[16px]">
            {/* {followersData?.length} */}
            100
          </strong>{" "}
          followers
        </div>
      </div>
      <div>
        <Dot className="size-5 text-neutral-100" />
      </div>
      <div>
        <strong className="text-neutral-100 text-[16px]">
          {/* {followingData?.length} */}
          40
        </strong>{" "}
        following
      </div>
    </div>
  );
}
