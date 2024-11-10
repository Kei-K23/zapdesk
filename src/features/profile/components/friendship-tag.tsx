import useToggleFriendship from "@/features/friendships/mutation/use-toggle-friendship";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabsContent } from "@/components/ui/tabs";

interface FriendshipTagProps {
  user: Doc<"users">;
  currentAuthUser?: Doc<"users">;
  followers: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
  following: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
  currentAuthUserFollowing?: Array<{
    user: Doc<"users">;
    friendships: Doc<"friendships">;
  }>;
}

export default function FriendshipTag({
  user,
  currentAuthUser,
  followers,
  following,
  currentAuthUserFollowing,
}: FriendshipTagProps) {
  const { toast } = useToast();
  const [followingInProgress, setFollowingInProgress] = useState<
    Set<Id<"users">>
  >(new Set());

  const { mutate: toggleFollowship, isPending: isToggleFollowshipPending } =
    useToggleFriendship();

  const handleToggleFollow = useCallback(
    async (followerId: Id<"users">, targetUserId: Id<"users">) => {
      if (!followerId) {
        toast({
          title: "Authentication required",
          description: "Please sign in to follow users.",
          variant: "destructive",
        });
        return;
      }

      if (targetUserId === followerId) {
        toast({
          title: "Invalid action",
          description: "You cannot follow yourself.",
          variant: "destructive",
        });
        return;
      }

      setFollowingInProgress((prev) => {
        const next = new Set(prev);
        next.add(targetUserId);
        return next;
      });

      try {
        await toggleFollowship(
          {
            followerId: followerId,
            followingId: targetUserId,
          },
          {
            onSuccess: () => {
              const isNowFollowing = !isFollowing(targetUserId);
              toast({
                title: isNowFollowing
                  ? "Followed successfully"
                  : "Unfollowed successfully",
                description: isNowFollowing
                  ? `You are now following`
                  : `You have unfollowed`,
              });
            },
            onError: (error) => {
              console.error("Failed to toggle followship:", error);
              toast({
                title: "Action failed",
                description:
                  "Failed to update follow status. Please try again.",
                variant: "destructive",
              });
            },
          }
        );
      } finally {
        setFollowingInProgress((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
      }
    },
    [currentAuthUser, toggleFollowship, toast]
  );

  const isFollowing = useCallback(
    (userId: Id<"users">) => {
      if (!!currentAuthUser) {
        return currentAuthUserFollowing?.some((f) => f.user._id === userId);
      } else if (!!user) {
        console.log("here in user", {
          currentAuthUser,
          currentAuthUserFollowing,
        });

        return following.some((f) => f.user._id === userId);
      }
    },
    [following, currentAuthUserFollowing, currentAuthUser, user]
  );

  const isOwnProfile = useCallback(
    (targetUserId: Id<"users">) => {
      if (!!currentAuthUser) {
        return currentAuthUser._id === targetUserId;
      } else if (!!user) {
        return user._id === targetUserId;
      }
    },
    [currentAuthUser, user]
  );

  const renderFollowButton = useCallback(
    (targetUser: Doc<"users">) => {
      if (isOwnProfile(targetUser._id)) return null;

      const isProcessing = followingInProgress.has(targetUser._id);
      const followingStatus = isFollowing(targetUser._id);

      return (
        <Button
          variant={followingStatus ? "destructive" : "default"}
          size="sm"
          disabled={isProcessing || isToggleFollowshipPending}
          onClick={() => {
            if (!!currentAuthUser) {
              console.log({ currentAuthUser, targetUser });

              return handleToggleFollow(currentAuthUser._id, targetUser._id);
            } else if (!!user) {
              return handleToggleFollow(user._id, targetUser._id);
            }
          }}
          className="w-28 flex items-center gap-2"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : followingStatus ? (
            <>
              <UserMinus className="h-4 w-4" />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Follow
            </>
          )}
        </Button>
      );
    },
    [
      isOwnProfile,
      followingInProgress,
      isToggleFollowshipPending,
      handleToggleFollow,
      isFollowing,
    ]
  );

  const renderUserItem = useCallback(
    (userData: Doc<"users">) => (
      <div
        key={userData._id}
        className="flex items-center justify-between gap-x-5 border-b border-border p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userData.image} alt={userData.name} />
            <AvatarFallback className="text-xl font-semibold">
              {userData.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium leading-none">{userData.name}</p>
            {userData.role && (
              <p className="text-sm text-muted-foreground">{userData.role}</p>
            )}
          </div>
        </div>
        {renderFollowButton(userData)}
      </div>
    ),
    [renderFollowButton]
  );

  return (
    <>
      <TabsContent value="followers">
        <div className="divide-y divide-border">
          {followers.length > 0 ? (
            followers.map((follower) => renderUserItem(follower.user))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No followers yet
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="following">
        <div className="divide-y divide-border">
          {following.length > 0 ? (
            following.map((follow) => renderUserItem(follow.user))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Not following anyone yet
            </p>
          )}
        </div>
      </TabsContent>
    </>
  );
}
