"use client";

import { useGetUser } from "@/features/auth/query/use-get-user";
import { Id } from "../../../../../convex/_generated/dataModel";
import ProfileContainer from "@/features/profile/components/profile-container";

interface UserProfileIdPagePros {
  params: {
    userId: string;
  };
}

export default function UserProfileIdPage({ params }: UserProfileIdPagePros) {
  const { data: currentUser, isLoading: currentUserLoading } = useGetUser(
    params.userId as Id<"users">
  );
  return <ProfileContainer user={currentUser!} handleSaveProfile={() => {}} />;
}
