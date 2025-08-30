
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteBookAction } from '@/lib/actions';
import { useDeleteBookDialogStore } from '@/hooks/use-delete-book-dialog-store';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? 'Deleting...' : 'Delete'}
      <Trash2 className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function DeleteBookDialog() {
  const { isOpen, bookToDelete, onClose } = useDeleteBookDialogStore();
  const { toast } = useToast();
  
  const [state, action] = useActionState(deleteBookAction, {
    message: '',
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.message.includes('Error') ? 'Error' : 'Success',
        description: state.message,
        variant: state.message.includes('Error') ? 'destructive' : 'default',
      });
      if (!state.message.includes('Error')) {
        onClose();
      }
    }
  }, [state, toast, onClose]);

  if (!isOpen || !bookToDelete) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the book
            <span className="font-semibold"> "{bookToDelete.title}"</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={action}>
            <input type="hidden" name="id" value={bookToDelete.id} />
            <AlertDialogFooter>
                <AlertDialogCancel asChild>
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                </AlertDialogCancel>
                <DeleteButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
