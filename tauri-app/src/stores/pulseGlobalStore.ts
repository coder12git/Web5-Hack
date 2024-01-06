import { create } from "zustand";

type PulseGlobalStore = {
  isAuthBtnClicked: boolean;
  toggleIsAuthBtnClicked: () => void;
};

export const usePulseGlobalStore = create<PulseGlobalStore>((set) => ({
  isAuthBtnClicked: true,
  toggleIsAuthBtnClicked: () => {
    set((state) => ({ isAuthBtnClicked: !state.isAuthBtnClicked }));
  },
}));
