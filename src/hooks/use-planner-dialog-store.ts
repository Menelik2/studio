
import { create } from 'zustand';
import type { PlannerItem } from '@/lib/definitions';

interface PlannerDialogState {
  isOpen: boolean;
  item: PlannerItem | null;
  onSubmit: ((item: PlannerItem) => void) | null;
  onOpen: (item: PlannerItem | null, onSubmit: (item: PlannerItem) => void) => void;
  onClose: () => void;
}

export const usePlannerDialogStore = create<PlannerDialogState>((set) => ({
  isOpen: false,
  item: null,
  onSubmit: null,
  onOpen: (item, onSubmit) => set({ isOpen: true, item, onSubmit }),
  onClose: () => set({ isOpen: false, item: null, onSubmit: null }),
}));
