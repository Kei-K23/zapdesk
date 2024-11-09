/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useCurrentUser } from "@/features/auth/query/use-current-user";
import ProfileContainer, {
  ProfileContainerSkeleton,
} from "./profile-container";
import useGetFollowers from "@/features/friendships/query/use-get-followers";
import useGetFollowings from "@/features/friendships/query/use-get-followings";

export default function ProfileScreen() {
  const { data: currentAuthUser, isLoading: currentAuthUserLoading } =
    useCurrentUser();
  const { data: followersData, isLoading: followersDataLoading } =
    useGetFollowers({ userId: currentAuthUser?._id! });
  const { data: followingData, isLoading: followingDataLoading } =
    useGetFollowings({
      userId: currentAuthUser?._id!,
    });

  const isLoading =
    currentAuthUserLoading || followersDataLoading || followingDataLoading;

  if (isLoading) {
    return <ProfileContainerSkeleton />;
  }

  if (!currentAuthUser) {
    return <div>No use found</div>;
  }

  return (
    <ProfileContainer
      isCurrentUserSelf={true}
      user={currentAuthUser}
      isLoading={isLoading}
      followers={followersData ?? []}
      following={followingData ?? []}
    />
  );
}
