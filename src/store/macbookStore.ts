import { create } from 'zustand';

type Mode = 'open' | 'closed';

type MacbookState = {
  mode: Mode;
  // True only once the lid has finished its CLOSE animation (and the camera has
  // settled to the 3/4 view). The frame loop sets this; it drives the TopMenu
  // reveal on Home so the nav appears after the laptop is done closing — and
  // hides the instant the laptop starts opening again.
  settledClosed: boolean;
  setMode: (mode: Mode) => void;
  setSettledClosed: (settledClosed: boolean) => void;
  toggle: () => void;
};

export const useMacbookStore = create<MacbookState>((set) => ({
  mode: 'open',
  settledClosed: false,
  // Any mode change restarts the transition, so the "settled" flag resets.
  setMode: (mode) => set({ mode, settledClosed: false }),
  setSettledClosed: (settledClosed) => set({ settledClosed }),
  toggle: () => set((state) => ({ mode: state.mode === 'open' ? 'closed' : 'open', settledClosed: false }))
}));
