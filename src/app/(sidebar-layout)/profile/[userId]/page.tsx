"use client";

import { useGetUser } from "@/features/auth/query/use-get-user";
import { Id } from "../../../../../convex/_generated/dataModel";
import ProfileContainer from "@/features/profile/components/profile-container";
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

  return (
    <ProfileContainer
      isCurrentUserSelf={false}
      user={user!}
      currentAuthUser={currentAuthUser!}
      isLoading={userLoading || currentAuthUserLoading}
      followers={followersData!}
      following={followingData!}
      handleSaveProfile={() => {}}
    />
  );
}
