"use client";

import { useGetUser } from "@/features/auth/query/use-get-user";
import { Id } from "../../../../../convex/_generated/dataModel";

interface UserProfileIdPagePros {
  params: {
    userId: string;
  };
}

export default function UserProfileIdPage({ params }: UserProfileIdPagePros) {
  const { data: currentUser, isLoading: currentUserLoading } = useGetUser(
    params.userId as Id<"users">
  );
  return <div>{currentUser?.name}</div>;
}
