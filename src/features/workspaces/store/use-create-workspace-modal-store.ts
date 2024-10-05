import { atom, useAtom } from "jotai";
const modalAtom = atom(false);

export const useCreateWorkspaceModalStore = () => {
  return useAtom(modalAtom);
};
