
import { create } from 'zustand';
import type { Book } from '@/lib/definitions';

type BookDialogMode = 'edit' | 'comment' | 'create';

interface BookDialogState {
  isOpen: boolean;
  mode: BookDialogMode;
  book: Book | null;
  onOpen: (book: Book | null, mode: BookDialogMode) => void;
  onClose: () => void;
}

export const useBookDialogStore = create<BookDialogState>((set) => ({
  isOpen: false,
  mode: 'create',
  book: null,
  onOpen: (book, mode) => set({ isOpen: true, book, mode }),
  onClose: () => set({ isOpen: false, book: null }),
}));
