import { create } from "zustand";

export type AppView = "onboarding" | "dashboard" | "settings";

type AppState = {
    view: AppView;
    setView: (view: AppView) => void;
};

export const useAppStore = create<AppState>((set) => ({
    view: "onboarding",
    setView: (view) => set({ view }),
}));
