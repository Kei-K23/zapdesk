"use client";

import { useCurrentUser } from "@/features/auth/query/use-current-user";

export default function CurrentAuthUserHome() {
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  return <div>{currentUser?.name}</div>;
}
