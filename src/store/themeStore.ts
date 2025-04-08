import { create } from 'zustand';

type Theme = 'dark' | 'light';

type ThemeState = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

export const useThemeStore = create<ThemeState>((set) => ({
  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  theme: (() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? (storedTheme as Theme) : 'dark';
  })()
}));
