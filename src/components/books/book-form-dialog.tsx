
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateBookAction, createBookAction } from '@/lib/actions';
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
import { uploadPdfAction } from '@/lib/actions';

const bookFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት']),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()),
  description: z.string().min(1, 'Description is required'),
  filePath: z.string().url({ message: 'A valid PDF URL is required.' }).or(z.literal('')),
  comment: z.string().optional(),
});

const commentFormSchema = z.object({
  id: z.string(),
  comment: z.string().optional(),
});


type BookFormValues = z.infer<typeof bookFormSchema>;

function SubmitButton({ isPending }: { isPending: boolean }) {
  const { onClose } = useBookDialogStore();
  return (
    <>
      <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
        <Save className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
}

export function BookFormDialog() {
  const { isOpen, book, mode, onClose } = useBookDialogStore();
  const { toast } = useToast();
  const [isUploading, startUploadTransition] = useTransition();

  const isCommentMode = mode === 'comment';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';
  
  const currentSchema = isCommentMode ? commentFormSchema : bookFormSchema;

  const form = useForm<BookFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
        id: '',
        title: '',
        author: '',
        category: 'ግጥም',
        year: new Date().getFullYear(),
        description: '',
        filePath: '',
        comment: '',
    },
  });
  
  const { formState: { isSubmitting, errors }, setValue, control, register, reset } = form;

  useEffect(() => {
    if (isOpen) {
      if (book) {
        reset(book);
      } else {
        reset({
          id: '',
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

  const formAction = async (formData: FormData) => {
    let result: FormState;
    if (isCreateMode) {
      result = await createBookAction(formData);
    } else {
      // For both 'edit' and 'comment' mode, we use update
      result = await updateBookAction(formData);
    }
    
    if (result.message && !result.errors) {
        toast({ title: mode === 'create' ? 'Book Added' : 'Book Updated', description: result.message });
        onClose();
    } else if (result.message && result.errors) {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
        // You can set form errors here if needed, e.g. for server-side validation
    }
  };
  
  if (!isOpen) return null;

  const getTitle = () => {
    if (isCommentMode) return `Comment on "${book?.title}"`;
    if (isEditMode) return 'Edit Book';
    return 'Add New Book';
  }

  const getDescription = () => {
    if (isCommentMode) return 'Add or update the comment for this book.';
    if (isEditMode) return 'Update the details of this book.';
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
        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" {...register('id')} />

          {/* This hidden input helps the server action distinguish comment updates */}
          {isCommentMode && <input type="hidden" name="__comment_update" value="true" />}

          {mode !== 'comment' ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" {...register('title')} className="col-span-3" />
                {errors.title && <p className="col-span-4 text-red-500 text-xs text-right">{errors.title?.message}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">Author</Label>
                <Input id="author" {...register('author')} className="col-span-3" />
                {errors.author && <p className="col-span-4 text-red-500 text-xs text-right">{errors.author?.message}</p>}
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
                {errors.category && <p className="col-span-4 text-red-500 text-xs text-right">{errors.category?.message}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <Input id="year" type="number" {...register('year')} className="col-span-3" />
                {errors.year && <p className="col-span-4 text-red-500 text-xs text-right">{errors.year?.message}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" {...register('description')} className="col-span-3" />
                {errors.description && <p className="col-span-4 text-red-500 text-xs text-right">{errors.description?.message}</p>}
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
                   {errors.filePath && <p className="text-red-500 text-xs text-right">{errors.filePath?.message}</p>}
                </div>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">Comment</Label>
                <Textarea id="comment" {...register('comment')} className="col-span-3" placeholder="Add an optional comment..."/>
                {errors.comment && <p className="col-span-4 text-red-500 text-xs text-right">{errors.comment?.message}</p>}
              </div>
            </>
          ) : (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">Comment</Label>
                <Textarea id="comment" {...register('comment')} className="col-span-3" placeholder="Add a comment..."/>
                {errors.comment && <p className="col-span-4 text-red-500 text-xs text-right">{errors.comment?.message}</p>}
              </div>
          )}

          <DialogFooter>
            <SubmitButton isPending={isSubmitting} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
