import { create } from 'zustand';

type Mode = 'open' | 'closed';

// How long to let the TopMenu fade out before the lid starts opening, so the two
// don't animate on top of each other. Roughly matches the nav's exit.
const MENU_HIDE_MS = 450;

type MacbookState = {
  mode: Mode;
  // True only once the lid has finished its CLOSE animation (and the camera has
  // settled to the 3/4 view). The frame loop sets this; it drives the TopMenu
  // reveal on Home so the nav appears after the laptop is done closing.
  settledClosed: boolean;
  setMode: (mode: Mode) => void;
  setSettledClosed: (settledClosed: boolean) => void;
  // Open the lid, but if the TopMenu is currently showing (laptop was closed),
  // hide it first and only start opening once it's gone.
  requestOpen: () => void;
  toggle: () => void;
};

export const useMacbookStore = create<MacbookState>((set, get) => ({
  mode: 'open',
  settledClosed: false,
  setMode: (mode) => set({ mode, settledClosed: false }),
  setSettledClosed: (settledClosed) => set({ settledClosed }),
  requestOpen: () => {
    if (get().mode === 'open') return;
    if (get().settledClosed) {
      set({ settledClosed: false }); // start hiding the TopMenu
      setTimeout(() => set({ mode: 'open' }), MENU_HIDE_MS); // then open the lid
    } else {
      set({ mode: 'open' });
    }
  },
  toggle: () => {
    if (get().mode === 'open') set({ mode: 'closed', settledClosed: false });
    else get().requestOpen();
  }
}));
