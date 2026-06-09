import { create } from 'zustand';

type Mode = 'open' | 'closed';

type MacbookState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggle: () => void;
};

export const useMacbookStore = create<MacbookState>((set) => ({
  mode: 'open',
  setMode: (mode) => set({ mode }),
  toggle: () => set((state) => ({ mode: state.mode === 'open' ? 'closed' : 'open' }))
}));
