import { create } from 'zustand';

type Theme = 'dark' | 'light';

type ThemeState = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

const updateBodyClass = (theme: Theme) => document.body.classList.toggle('dark', theme === 'dark');

export const useThemeStore = create<ThemeState>((set) => {
  const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
  const initialTheme: Theme = storedTheme ? (storedTheme as Theme) : 'dark';

  updateBodyClass(initialTheme);

  return {
    setTheme: (theme: Theme) => {
      localStorage.setItem('theme', theme);
      updateBodyClass(theme);
      set({ theme });
    },
    theme: initialTheme
  };
});
