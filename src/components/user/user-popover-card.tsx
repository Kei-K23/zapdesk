import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Dot, MoreVertical, Users } from "lucide-react";
import useCreateFriendship from "@/features/friendships/mutation/use-create-friendship";
import { useCurrentUser } from "@/features/auth/query/use-current-user";
import useGetRelationship from "@/features/friendships/query/use-get-relationship";
import useRemoveFriendship from "@/features/friendships/mutation/use-remove-friendship";
import useGetFollowers from "@/features/friendships/query/use-get-followers";
import useGetFollowings from "@/features/friendships/query/use-get-followings";
import MemberManageDropdown from "@/features/workspaces/components/member-manage-dropdown";

interface UserHoverCardProps {
  children: React.ReactNode;
  isCurrentAuthUser: boolean;
  userId: Id<"users">;
  name: string;
  avatar?: string;
  authorId: Id<"members">;
  authorRole: "admin" | "member" | "moderator" | undefined;
  currentAuthMember?: Doc<"members">;
  bio?: string;
  workspaces?: Doc<"workspaces">[];
}

export default function UserPopoverCard({
  children,
  name,
  avatar,
  workspaces,
  bio,
  userId,
  isCurrentAuthUser,
  authorId,
  authorRole,
  currentAuthMember,
}: UserHoverCardProps) {
  const {
    mutate: createFriendshipMutation,
    isPending: createFriendshipPending,
  } = useCreateFriendship();
  const {
    mutate: removeFriendshipMutation,
    isPending: removeFriendshipPending,
  } = useRemoveFriendship();
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const { data: relationship, isLoading: relationshipLoading } =
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    useGetRelationship({ userOneId: currentUser?._id!, userTwoId: userId });
  const { data: followersData, isLoading: followersDataLoading } =
    useGetFollowers({ userId });
  const { data: followingData, isLoading: followingDataLoading } =
    useGetFollowings({ userId });

  const fallbackAvatar = name?.charAt(0)?.toUpperCase();
  const isLoading =
    currentUserLoading ||
    relationshipLoading ||
    createFriendshipPending ||
    removeFriendshipPending ||
    followersDataLoading ||
    followingDataLoading;

  const handleFriendship = () => {
    if (!currentUser) return;

    if (!!relationship) {
      removeFriendshipMutation(
        {
          userOneId: currentUser._id,
          userTwoId: userId,
        },
        {
          onSuccess: () => {},
          onError: () => {},
        }
      );
    } else {
      createFriendshipMutation(
        {
          userOneId: currentUser._id,
          userTwoId: userId,
        },
        {
          onSuccess: () => {},
          onError: () => {},
        }
      );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="flex items-start justify-between gap-x-4">
          <Avatar className="size-14 hover:opacity-75 transition-all mr-2 rounded-md">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-white rounded-md text-[16px] md:text-lg bg-indigo-600 font-bold">
              {fallbackAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-x-1">
            {!isCurrentAuthUser && (
              <Button
                onClick={handleFriendship}
                variant={"outline"}
                size={"sm"}
                disabled={isLoading}
              >
                {!!relationship ? "Unfollow" : "Follow"}
              </Button>
            )}
            <MemberManageDropdown
              currentAuthMember={currentAuthMember}
              authorId={authorId}
              authorRole={authorRole}
              authorUserId={userId}
            >
              <Button
                variant={"ghost"}
                size={"sm"}
                className="px-1"
                disabled={isLoading}
              >
                <MoreVertical className="size-4" />
              </Button>
            </MemberManageDropdown>
          </div>
        </div>
        <div className="flex items-center gap-x-1 mt-2">
          <span className={"text-[16px] md:text-lg font-semibold truncate"}>
            {name}
          </span>
        </div>
        <p className="text-muted-foreground text-sm my-1.5 text-wrap">
          {bio ?? "No bio provided"}
        </p>
        <div className="mt-1 flex items-center gap-x-0.5 text-muted-foreground text-sm">
          <div className="flex items-center gap-x-0.5">
            <Users className="size-4 mr-1" />
            <div>
              <strong className="text-neutral-100">
                {followersData?.length}
              </strong>{" "}
              followers
            </div>
          </div>
          <div>
            <Dot className="size-4 text-neutral-100" />
          </div>
          <div>
            <strong className="text-neutral-100">
              {followingData?.length}
            </strong>{" "}
            following
          </div>
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
      </PopoverContent>
    </Popover>
  );
}
