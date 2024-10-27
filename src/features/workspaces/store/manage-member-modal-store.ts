import { atom, useAtom } from "jotai";
import { Id } from "../../../../convex/_generated/dataModel";

type ManageMemberModalStoreType = {
  open: boolean;
  memberId: Id<"members"> | null;
  role: "admin" | "moderator" | "member" | undefined;
  currentAuthMemberRole: "admin" | "moderator" | "member" | undefined;
};

// Set a default value for the modal state
const modalAtom = atom<ManageMemberModalStoreType>({
  open: false,
  memberId: null,
  role: undefined,
  currentAuthMemberRole: undefined,
});

export const useManageMemberModalStore = () => {
  return useAtom(modalAtom);
};
