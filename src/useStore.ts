import { create } from 'zustand';

export const useStore = create(() => ({
  // Whether the logo intro animation has played
  loaded: false
}));
