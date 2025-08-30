
import { create } from 'zustand';
import type { Book } from '@/lib/definitions';

interface DeleteBookDialogState {
  isOpen: boolean;
  bookToDelete: Book | null;
  onOpen: (book: Book) => void;
  onClose: () => void;
}

export const useDeleteBookDialogStore = create<DeleteBookDialogState>((set) => ({
  isOpen: false,
  bookToDelete: null,
  onOpen: (book) => set({ isOpen: true, bookToDelete: book }),
  onClose: () => set({ isOpen: false, bookToDelete: null }),
}));
