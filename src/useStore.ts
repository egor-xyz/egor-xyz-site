import { create } from 'zustand';

export const useStore = create(() => ({
  loaded: false
}));
