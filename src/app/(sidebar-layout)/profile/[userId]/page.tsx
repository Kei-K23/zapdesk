/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useGetUser } from "@/features/auth/query/use-get-user";
import { Id } from "../../../../../convex/_generated/dataModel";
import ProfileContainer, {
  ProfileContainerSkeleton,
} from "@/features/profile/components/profile-container";
import useGetFollowers from "@/features/friendships/query/use-get-followers";
import useGetFollowings from "@/features/friendships/query/use-get-followings";
import { useCurrentUser } from "@/features/auth/query/use-current-user";

interface UserProfileIdPagePros {
  params: {
    userId: string;
  };
}

export default function UserProfileIdPage({ params }: UserProfileIdPagePros) {
  const { data: user, isLoading: userLoading } = useGetUser(
    params.userId as Id<"users">
  );
  const { data: currentAuthUser, isLoading: currentAuthUserLoading } =
    useCurrentUser();
  const { data: followersData, isLoading: followersDataLoading } =
    useGetFollowers({ userId: user?._id! });
  const { data: followingData, isLoading: followingDataLoading } =
    useGetFollowings({ userId: user?._id! });

  const isLoading =
    userLoading ||
    currentAuthUserLoading ||
    followersDataLoading ||
    followingDataLoading;

  if (isLoading) {
    return <ProfileContainerSkeleton />;
  }

  if (!user) {
    return <div>No use found</div>;
  }

  return (
    <ProfileContainer
      isCurrentUserSelf={currentAuthUser?._id === user?._id}
      user={user}
      currentAuthUser={currentAuthUser!}
      isLoading={isLoading}
      followers={followersData!}
      following={followingData!}
    />
  );
}
