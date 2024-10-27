/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useCurrentUser } from "@/features/auth/query/use-current-user";
import { Doc } from "../../../../convex/_generated/dataModel";
import ProfileContainer, {
  ProfileContainerSkeleton,
} from "./profile-container";
import useGetFollowers from "@/features/friendships/query/use-get-followers";
import useGetFollowings from "@/features/friendships/query/use-get-followings";

// Mock user data based on the provided schema
const initialUser = {
  name: "Jane Doe",
  image: "/placeholder.svg?height=128&width=128",
  email: "jane.doe@example.com",
  isPublishEmail: true,
  bio: "Passionate developer and tech enthusiast. Always learning, always coding.",
  role: "Senior Software Engineer",
  githubLink: "https://github.com/janedoe",
  personalLink: "https://janedoe.com",
  twitterLink: "https://twitter.com/janedoe",
  youTubeLink: "https://youtube.com/janedoe",
  igLink: "https://instagram.com/janedoe",
  phone: "+1 (555) 123-4567",
  isAnonymous: false,
};

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
