import { atom, useAtom } from "jotai";
const modalAtom = atom(false);

export const useCreateChannelModalStore = () => {
  return useAtom(modalAtom);
};
