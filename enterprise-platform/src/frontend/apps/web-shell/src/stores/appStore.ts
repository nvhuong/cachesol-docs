import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  language: 'vi' | 'en';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLanguage: (lang: 'vi' | 'en') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  language: 'vi',

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  setLanguage: (lang) => {
    set({ language: lang });
  },
}));
