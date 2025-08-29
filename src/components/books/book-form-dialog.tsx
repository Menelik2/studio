
'use client';

import { useActionState, useEffect, useState, useCallback, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateBookAction, createBookAction, uploadPdfAction } from '@/lib/actions';
import type { Book } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { Save, UploadCloud, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';


interface BookDialogState {
  isOpen: boolean;
  book: Book | null;
  mode: 'edit' | 'comment' | 'create';
}

interface BookDialogStore extends BookDialogState {
  onOpen: (book: Book | null, mode: 'edit' | 'comment' | 'create') => void;
  onClose: () => void;
}

// This is a bit of a hack to create a global store without Zustand
// In a real app, you would use a state management library.
let state: BookDialogState = {
    isOpen: false,
    book: null,
    mode: 'create',
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
    onOpen: (book: Book | null, mode: 'edit' | 'comment' | 'create') => {
        store.setState(() => ({ isOpen: true, book, mode }));
    },
    onClose: () => {
        store.setState(() => ({ isOpen: false, book: null, mode: 'create' }));
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
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት']),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()),
  description: z.string().min(1, 'Description is required'),
  filePath: z.string().url({ message: 'A valid URL is required. Please upload a file to get a URL.' }),
  comment: z.string().optional(),
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
  const { isOpen, book, mode, onClose } = useBookDialog();
  const { toast } = useToast();
  const isEdit = !!book;
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, startUploadTransition] = useTransition();

  
  const action = isEdit ? updateBookAction : createBookAction;
  
  const [formState, formAction] = useActionState(action, {
    message: '',
    errors: {},
  });

  const { register, reset, control, formState: { errors }, setValue, watch } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
        title: '',
        author: '',
        category: 'ግጥም',
        year: new Date().getFullYear(),
        description: '',
        filePath: '',
        comment: '',
    },
  });

  const currentFilePath = watch('filePath');

  useEffect(() => {
    if (isOpen) {
      if (book) {
        reset(book);
      } else {
        reset({
          title: '',
          author: '',
          category: 'ግጥም',
          year: new Date().getFullYear(),
          description: '',
          filePath: '',
          comment: '',
        });
      }
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
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [setValue, toast]);

  const handleFileUpload = (file: File) => {
    if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);

        startUploadTransition(async () => {
            const result = await uploadPdfAction(formData);
            if(result.success && result.path) {
                setValue('filePath', result.path, { shouldValidate: true });
                toast({
                    title: 'File Uploaded!',
                    description: `Successfully uploaded "${file.name}"`
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Upload Failed',
                    description: result.error,
                });
            }
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please drop a PDF file.',
        });
      }
  }

  if (!isOpen) return null;
  
  const getTitle = () => {
    if (mode === 'comment') return 'Add/Edit Comment';
    if (mode === 'edit') return 'Edit Book';
    return 'Add New Book';
  }
  
  const getDescription = () => {
    if (mode === 'comment') return 'Add or update the comment for this book.';
    if (mode === 'edit') return 'Update the details of this book.';
    return 'Fill in the details for the new book.';
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if(!open) {
        reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{getTitle()}</DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" {...register('id')} value={book?.id ?? ''} />
          
          {mode !== 'comment' && (
            <>
              <input type="hidden" {...register('comment')} value={book?.comment ?? ''} />
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
                    <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ግጥም">ግጥም</SelectItem>
                        <SelectItem value="ወግ">ወግ</SelectItem>
                        <SelectItem value="ድራማ">ድራማ</SelectItem>
                        <SelectItem value="መነባንብ">መነባንብ</SelectItem>
                        <SelectItem value="መጣጥፍ">መጣጥፍ</SelectItem>
                        <SelectItem value="ሌሎች መፅሐፍት">ሌሎች መፅሐፍት</SelectItem>
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
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="filePath" className="text-right pt-2">PDF File</Label>
                <div className="col-span-3 space-y-2">
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('pdf-upload-input')?.click()}
                    className={cn(
                      'relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                      isDragging ? 'border-primary bg-muted/50' : 'border-input'
                    )}
                  >
                    <input 
                      type="file" 
                      id="pdf-upload-input" 
                      className="hidden"
                      accept="application/pdf"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag & drop or click to upload a PDF
                        </p>
                      </>
                    )}
                  </div>
                  <Input
                    id="filePath"
                    placeholder="Upload a file to get a URL"
                    {...register('filePath')}
                    disabled={isUploading}
                    readOnly
                  />
                   {errors.filePath && <p className="text-red-500 text-xs text-right">{errors.filePath.message}</p>}
                   {formState.errors?.filePath && <p className="text-red-500 text-xs text-right">{formState.errors.filePath[0]}</p>}
                </div>
              </div>
            </>
          )}

          {mode === 'comment' && (
             <>
              <input type="hidden" {...register('title')} />
              <input type="hidden" {...register('author')} />
              <input type="hidden" {...register('category')} />
              <input type="hidden" {...register('year')} />
              <input type="hidden" {...register('description')} />
              <input type="hidden" {...register('filePath')} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">Comment</Label>
                <Textarea id="comment" {...register('comment')} className="col-span-3" placeholder="Add a comment..."/>
                {errors.comment && <p className="col-span-4 text-red-500 text-xs text-right">{errors.comment.message}</p>}
                {formState.errors?.comment && <p className="col-span-4 text-red-500 text-xs text-right">{formState.errors.comment[0]}</p>}
              </div>
            </>
          )}
          
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
