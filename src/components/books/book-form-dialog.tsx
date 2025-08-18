'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { createBookAction, updateBookAction } from '@/lib/actions';
import type { Book, Category } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';

interface BookDialogState {
  isOpen: boolean;
  book: Book | null;
  onOpen: (book: Book | null) => void;
  onClose: () => void;
}

const useBookDialogStore = (
  (set) => ({
    isOpen: false,
    book: null,
    onOpen: (book) => set({ isOpen: true, book }),
    onClose: () => set({ isOpen: false, book: null }),
  })
);

// This is a bit of a hack to create a global store without Zustand
// In a real app, you would use a state management library.
let state: BookDialogState = useBookDialogStore(() => {});
const listeners = new Set<(state: BookDialogState) => void>();
const set = (updater: (state: BookDialogState) => Partial<BookDialogState>) => {
  state = { ...state, ...updater(state) };
  listeners.forEach((listener) => listener(state));
};
useBookDialogStore(set);

export const useBookDialog = () => {
  const [dialogState, setDialogState] = useState(state);
  useEffect(() => {
    listeners.add(setDialogState);
    return () => {
      listeners.delete(setDialogState);
    };
  }, []);
  return dialogState;
};

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.enum(['Poetry', 'Tradition', 'Drama']),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()),
  description: z.string().min(1, 'Description is required'),
  filePath: z.string().min(1, 'File path is required'),
});

type BookFormValues = z.infer<typeof bookSchema>;

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Book')}
      <Save className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function BookFormDialog() {
  const { isOpen, book, onClose } = useBookDialog();
  const { toast } = useToast();
  const isEdit = !!book;

  const [createState, createAction] = useFormState(createBookAction, { message: '', errors: {} });
  const [updateState, updateAction] = useFormState(updateBookAction, { message: '', errors: {} });

  const formAction = isEdit ? updateAction : createAction;
  const formState = isEdit ? updateState : createState;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (book) {
      reset(book);
    } else {
      reset({
        title: '',
        author: '',
        category: 'Poetry',
        year: new Date().getFullYear(),
        description: '',
        filePath: '',
      });
    }
  }, [book, reset]);

  useEffect(() => {
    if(formState.message && !formState.errors) {
      toast({ title: isEdit ? 'Book Updated' : 'Book Added', description: formState.message });
      onClose();
    } else if (formState.message && formState.errors) {
      toast({ variant: 'destructive', title: 'Error', description: formState.message });
    }
  }, [formState, toast, onClose, isEdit]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEdit ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of this book.' : 'Fill in the details for the new book.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          {isEdit && <input type="hidden" {...register('id')} value={book.id} name="id" />}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" {...register('title')} className="col-span-3" name="title" defaultValue={book?.title}/>
            {formState.errors?.title && <p className="col-span-4 text-red-500 text-xs">{formState.errors.title[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">Author</Label>
            <Input id="author" {...register('author')} className="col-span-3" name="author" defaultValue={book?.author}/>
            {formState.errors?.author && <p className="col-span-4 text-red-500 text-xs">{formState.errors.author[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
             <select name="category" defaultValue={book?.category} className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                <option value="Poetry">Poetry</option>
                <option value="Tradition">Tradition</option>
                <option value="Drama">Drama</option>
            </select>
            {formState.errors?.category && <p className="col-span-4 text-red-500 text-xs">{formState.errors.category[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">Year</Label>
            <Input id="year" type="number" {...register('year')} className="col-span-3" name="year" defaultValue={book?.year}/>
            {formState.errors?.year && <p className="col-span-4 text-red-500 text-xs">{formState.errors.year[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" {...register('description')} className="col-span-3" name="description" defaultValue={book?.description}/>
            {formState.errors?.description && <p className="col-span-4 text-red-500 text-xs">{formState.errors.description[0]}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filePath" className="text-right">File Path</Label>
            <Input id="filePath" {...register('filePath')} className="col-span-3" name="filePath" defaultValue={book?.filePath}/>
            {formState.errors?.filePath && <p className="col-span-4 text-red-500 text-xs">{formState.errors.filePath[0]}</p>}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <SubmitButton isEdit={isEdit} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
