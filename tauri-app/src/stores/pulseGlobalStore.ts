import { create } from "zustand";

type PulseGlobalStore = {
  showAuthModal: boolean;
  toggleAuthModal: () => void;
};

export const usePulseGlobalStore = create<PulseGlobalStore>((set) => ({
  showAuthModal: true,
  toggleAuthModal: () => {
    set((state) => ({ showAuthModal: !state.showAuthModal }));
  },
}));
