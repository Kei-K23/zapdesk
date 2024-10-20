"use client";

import { useMemberProfileId } from "./use-member-profile-id";

export const useMemberProfilePanel = () => {
  const [memberProfileId, setMemberProfileId] = useMemberProfileId();

  const onOpenMemberProfile = (id: string) => {
    setMemberProfileId(id);
  };

  const onClose = () => {
    setMemberProfileId(null);
  };

  return {
    memberProfileId,
    onOpenMemberProfile,
    onClose,
  };
};
