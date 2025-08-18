'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteBookAction } from '@/lib/actions';
import type { Book } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface DeleteDialogState {
  isOpen: boolean;
  bookToDelete: Book | null;
  onOpen: (book: Book) => void;
  onClose: () => void;
}

const useDeleteDialogStore = (
  (set) => ({
    isOpen: false,
    bookToDelete: null,
    onOpen: (book) => set({ isOpen: true, bookToDelete: book }),
    onClose: () => set({ isOpen: false, bookToDelete: null }),
  })
);

// Global store hack
let state: DeleteDialogState = useDeleteDialogStore(() => {});
const listeners = new Set<(state: DeleteDialogState) => void>();
const set = (updater: (state: DeleteDialogState) => Partial<DeleteDialogState>) => {
  state = { ...state, ...updater(state) };
  listeners.forEach((listener) => listener(state));
};
useDeleteDialogStore(set);

export const useDeleteBookDialog = () => {
  const [dialogState, setDialogState] = useState(state);
  useEffect(() => {
    listeners.add(setDialogState);
    return () => {
      listeners.delete(setDialogState);
    };
  }, []);
  return dialogState;
};

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? 'Deleting...' : 'Delete'}
      <Trash2 className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function DeleteBookDialog({ book }: { book: Book | null }) {
  const { isOpen, onClose } = useDeleteBookDialog();
  const { toast } = useToast();
  
  const [state, action] = useActionState(deleteBookAction.bind(null, book?.id ?? ''), {
    message: '',
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message.includes('Error') ? 'Error' : 'Success',
        description: state.message,
        variant: state.message.includes('Error') ? 'destructive' : 'default',
      });
      onClose();
    }
  }, [state, toast, onClose]);

  if (!isOpen || !book) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the book
            <span className="font-semibold"> "{book.title}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <form action={action} className="flex gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </AlertDialogCancel>
            <DeleteButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
