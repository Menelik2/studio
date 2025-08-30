
import { create } from 'zustand';
import type { Planner2Item } from '@/lib/definitions';

interface Planner2DialogState {
  isOpen: boolean;
  item: Planner2Item | null;
  onSubmit: ((item: Planner2Item) => void) | null;
  onOpen: (item: Planner2Item | null, onSubmit: (item: Planner2Item) => void) => void;
  onClose: () => void;
}

export const usePlanner2DialogStore = create<Planner2DialogState>((set) => ({
  isOpen: false,
  item: null,
  onSubmit: null,
  onOpen: (item, onSubmit) => set({ isOpen: true, item, onSubmit }),
  onClose: () => set({ isOpen: false, item: null, onSubmit: null }),
}));
