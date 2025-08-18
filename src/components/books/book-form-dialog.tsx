
'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Controller } from 'react-hook-form';


interface BookDialogState {
  isOpen: boolean;
  book: Book | null;
}

interface BookDialogStore extends BookDialogState {
  onOpen: (book: Book | null) => void;
  onClose: () => void;
}

// This is a bit of a hack to create a global store without Zustand
// In a real app, you would use a state management library.
let state: BookDialogState = {
    isOpen: false,
    book: null,
};
const listeners = new Set<(state: BookDialogState) => void>();

const store = {
    getState: () => state,
    setState: (updater: (state: BookDialogState) => Partial<BookDialogState>) => {
        state = { ...state, ...updater(state) };
        listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener: (state: BookDialogState) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    onOpen: (book: Book | null) => {
        store.setState(() => ({ isOpen: true, book }));
    },
    onClose: () => {
        store.setState(() => ({ isOpen: false, book: null }));
    }
}


export const useBookDialog = (): BookDialogStore => {
  const [dialogState, setDialogState] = useState(store.getState());
  useEffect(() => {
    const unsubscribe = store.subscribe(setDialogState);
    return unsubscribe;
  }, []);
  
  return {
    ...dialogState,
    onOpen: store.onOpen,
    onClose: store.onClose
  };
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
  
  const [formState, formAction] = useActionState(
    isEdit ? updateBookAction : createBookAction,
    { message: '', errors: {} }
  );

  const { register, reset, control, formState: { errors } } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
        title: '',
        author: '',
        category: 'Poetry',
        year: new Date().getFullYear(),
        description: '',
        filePath: '',
    },
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
  }, [book, reset, isOpen]);

  useEffect(() => {
    if (formState.message && !formState.errors) {
      toast({ title: isEdit ? 'Book Updated' : 'Book Added', description: formState.message });
      onClose();
    } else if (formState.message && formState.errors) {
      toast({ variant: 'destructive', title: 'Error', description: formState.message });
    }
  }, [formState, toast, onClose, isEdit]);
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if(!open) {
        reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEdit ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of this book.' : 'Fill in the details for the new book.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          {isEdit && book && <input type="hidden" name="id" value={book.id} />}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" {...register('title')} className="col-span-3" />
            {errors.title && <p className="col-span-4 text-red-500 text-xs text-right">{errors.title.message}</p>}
            {formState.errors?.title && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.title[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">Author</Label>
            <Input id="author" {...register('author')} className="col-span-3" />
            {errors.author && <p className="col-span-4 text-red-500 text-xs text-right">{errors.author.message}</p>}
            {formState.errors?.author && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.author[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poetry">Poetry</SelectItem>
                    <SelectItem value="Tradition">Tradition</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="col-span-4 text-red-500 text-xs text-right">{errors.category.message}</p>}
            {formState.errors?.category && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.category[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">Year</Label>
            <Input id="year" type="number" {...register('year')} className="col-span-3" />
            {errors.year && <p className="col-span-4 text-red-500 text-xs text-right">{errors.year.message}</p>}
            {formState.errors?.year && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.year[0]}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" {...register('description')} className="col-span-3" />
            {errors.description && <p className="col-span-4 text-red-500 text-xs text-right">{errors.description.message}</p>}
            {formState.errors?.description && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.description[0]}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filePath" className="text-right">File Path</Label>
            <Input id="filePath" {...register('filePath')} className="col-span-3" />
            {errors.filePath && <p className="col-span-4 text-red-500 text-xs text-right">{errors.filePath.message}</p>}
            {formState.errors?.filePath && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.filePath[0]}</p>}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => {
                reset();
                onClose();
            }}>Cancel</Button>
            <SubmitButton isEdit={isEdit} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
