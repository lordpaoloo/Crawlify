import { create } from 'zustand';

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));