import { create } from "zustand";

type UIState = {
  quickCreateOpen: boolean;
  setQuickCreateOpen: (value: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  quickCreateOpen: false,
  setQuickCreateOpen: (value) => set({ quickCreateOpen: value }),
}));

