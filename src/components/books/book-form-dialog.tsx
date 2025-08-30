
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateBookAction, createBookAction, uploadPdfAction } from '@/lib/actions';
import { useBookDialogStore } from '@/hooks/use-book-dialog-store';
import type { Book, FormState } from '@/lib/definitions';
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
import { cn } from '@/lib/utils';

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት']),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()),
  description: z.string().min(1, 'Description is required'),
  filePath: z.string().url({ message: 'A valid PDF URL is required.' }).or(z.literal('')),
  comment: z.string().optional(),
});

const commentSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት']),
  year: z.coerce.number(),
  description: z.string(),
  filePath: z.string().url().or(z.literal('')),
  comment: z.string().optional(),
});


type BookFormValues = z.infer<typeof bookSchema>;

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? 'Saving...' : 'Save Changes'}
      <Save className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function BookFormDialog() {
  const { isOpen, book, mode, onClose } = useBookDialogStore();
  const { toast } = useToast();
  const [isUploading, startUploadTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [serverErrors, setServerErrors] = useState<FormState['errors'] | null>(null);

  const isCommentMode = mode === 'comment';

  const { register, handleSubmit, reset, control, formState: { errors }, setValue, watch } = useForm<BookFormValues>({
    resolver: zodResolver(isCommentMode ? commentSchema : bookSchema),
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
      setServerErrors(null);
    }
  }, [book, reset, isOpen]);

  const handleFileUpload = (file: File) => {
    if (file && file.type === 'application/pdf') {
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
      } else if (file) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please drop a PDF file.',
        });
      }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const onSubmit = (data: BookFormValues) => {
    startSubmitTransition(async () => {
        const action = mode === 'create' ? createBookAction : updateBookAction;
        const result = await action(data);

        if (result.message && !result.errors) {
            toast({ title: mode === 'create' ? 'Book Added' : 'Book Updated', description: result.message });
            onClose();
        } else if (result.message && result.errors) {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
            setServerErrors(result.errors);
        }
    });
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <input type="hidden" {...register('id')} />

          {mode !== 'comment' ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" {...register('title')} className="col-span-3" />
                {(errors.title || serverErrors?.title) && <p className="col-span-4 text-red-500 text-xs text-right">{errors.title?.message || serverErrors?.title?.[0]}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">Author</Label>
                <Input id="author" {...register('author')} className="col-span-3" />
                {(errors.author || serverErrors?.author) && <p className="col-span-4 text-red-500 text-xs text-right">{errors.author?.message || serverErrors?.author?.[0]}</p>}
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
                {(errors.category || serverErrors?.category) && <p className="col-span-4 text-red-500 text-xs text-right">{errors.category?.message || serverErrors?.category?.[0]}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <Input id="year" type="number" {...register('year')} className="col-span-3" />
                {(errors.year || serverErrors?.year) && <p className="col-span-4 text-red-500 text-xs text-right">{errors.year?.message || serverErrors?.year?.[0]}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" {...register('description')} className="col-span-3" />
                {(errors.description || serverErrors?.description) && <p className="col-span-4 text-red-500 text-xs text-right">{errors.description?.message || serverErrors?.description?.[0]}</p>}
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="filePath" className="text-right pt-2">PDF File</Label>
                <div className="col-span-3 space-y-2">
                  <div
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('pdf-upload-input')?.click()}
                    className={cn(
                      'relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-input'
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
                    placeholder="Paste a URL or upload a file to get a URL"
                    {...register('filePath')}
                    disabled={isUploading}
                  />
                   {(errors.filePath || serverErrors?.filePath) && <p className="text-red-500 text-xs text-right">{errors.filePath?.message || serverErrors?.filePath?.[0]}</p>}
                </div>
              </div>
            </>
          ) : (
             <>
              {/* These are hidden but registered so their values are preserved on submit */}
              <input type="hidden" {...register('title')} />
              <input type="hidden" {...register('author')} />
              <input type="hidden" {...register('category')} />
              <input type="hidden" {...register('year')} />
              <input type="hidden" {...register('description')} />
              <input type="hidden" {...register('filePath')} />
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">Comment</Label>
                <Textarea id="comment" {...register('comment')} className="col-span-3" placeholder="Add a comment..."/>
                {(errors.comment || serverErrors?.comment) && <p className="col-span-4 text-red-500 text-xs text-right">{errors.comment?.message || serverErrors?.comment?.[0]}</p>}
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <SubmitButton isPending={isSubmitting} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
