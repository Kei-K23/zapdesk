/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditUserProfileModal } from "./edit-user-profile-modal";
import ProfileTags from "./profile-tags";
import ProfileFriendshipSection from "./profile-friendship-section";
import ProfileAvatar, { ProfileAvatarSkeleton } from "./profile-avatar";
import { Doc } from "../../../../convex/_generated/dataModel";
import useGetRelationship from "@/features/friendships/query/use-get-relationship";
import useRemoveFriendship from "@/features/friendships/mutation/use-remove-friendship";
import useCreateFriendship from "@/features/friendships/mutation/use-create-friendship";
import { ArrowBigLeftDashIcon } from "lucide-react";
import Hint from "@/components/hint";
import { useRouter } from "next/navigation";

interface ProfileContainerProps {
  user: Doc<"users">;
  currentAuthUser?: Doc<"users">;
  isLoading: boolean;
  isCurrentUserSelf: boolean;
  isShowBackBtn?: boolean;
  followers: Doc<"users">[];
  following: Doc<"users">[];
}

export default function ProfileContainer({
  user,
  currentAuthUser,
  isLoading,
  isCurrentUserSelf,
  isShowBackBtn,
  followers,
  following,
}: ProfileContainerProps) {
  const router = useRouter();
  // This fetch query only happen currentAuthUser exist and isCurrentUserSelf is not true, So there is no will be raise null error for currentAuthUser
  const { data: relationship, isLoading: relationshipLoading } =
    useGetRelationship({
      userOneId: currentAuthUser?._id,
      userTwoId: user?._id,
    });

  const {
    mutate: removeRelationshipMutation,
    isPending: removeRelationshipMutationLoading,
  } = useRemoveFriendship();
  const {
    mutate: createFriendshipMutation,
    isPending: createFriendshipPending,
  } = useCreateFriendship();

  // This remove mutation query only happen currentAuthUser exist and isCurrentUserSelf is not true, So there is no will be raise null error for currentAuthUser
  const handleRemoveRelationship = () => {
    if (!currentAuthUser && !user) {
      return;
    }

    if (!!relationship) {
      removeRelationshipMutation(
        {
          userOneId: currentAuthUser?._id!,
          userTwoId: user?._id,
        },
        {
          onSuccess: () => {},
          onError: () => {},
        }
      );
    } else {
      createFriendshipMutation(
        {
          userOneId: currentAuthUser?._id!,
          userTwoId: user?._id,
        },
        {
          onSuccess: () => {},
          onError: () => {},
        }
      );
    }
  };

  const isPending =
    relationshipLoading ||
    removeRelationshipMutationLoading ||
    createFriendshipPending;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="relative">
          {isShowBackBtn && (
            <div className="absolute -left-16 top-0">
              <Hint label="Back">
                <Button variant={"ghost"} onClick={router.back}>
                  <ArrowBigLeftDashIcon className="size-6 text-muted-foreground" />
                </Button>
              </Hint>
            </div>
          )}
          <ProfileAvatar user={user} />
        </CardHeader>

        <CardContent className="space-y-4">
          {!!!isCurrentUserSelf && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <Button
                disabled={isPending}
                variant="outline"
                size="sm"
                onClick={handleRemoveRelationship}
              >
                {!!relationship ? "Unfollow" : "Follow"}
              </Button>
              <Button disabled={isPending} variant="outline" size="sm">
                Message
              </Button>
            </div>
          )}
          <ProfileFriendshipSection
            followers={followers}
            following={following}
          />
          <Separator />
          <ProfileTags
            isLoading={isLoading}
            user={user!}
            followers={followers}
            following={following}
          />
        </CardContent>

        <CardFooter className="flex justify-between">
          <EditUserProfileModal user={user!} />
          <Button variant="outline">Share Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const ProfileContainerSkeleton = () => (
  <div className="container mx-auto p-4 space-y-6">
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <ProfileAvatarSkeleton />
      </CardHeader>
    </Card>
  </div>
);
