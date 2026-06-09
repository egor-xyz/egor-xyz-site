import { create } from 'zustand';

export const useStore = create(() => ({
  // Whether the logo intro animation has played
  loaded: false,
  // Whether the Macbook fly-in + lid-open intro has played (once per session)
  macbookIntroDone: false
}));
