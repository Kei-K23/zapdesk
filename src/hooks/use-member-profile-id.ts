"use client";
import { useQueryState } from "nuqs";

export const useMemberProfileId = () => {
  return useQueryState("memberProfileId");
};
