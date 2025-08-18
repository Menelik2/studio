// @ts-nocheck
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addBook, deleteBook, updateBook, getPlanner1Items, savePlanner1Items, getPlanner2Items, savePlanner2Items } from './data';
import type { Book, Planner1Item, Planner2Item } from './definitions';

// Mock login action
export async function loginAction() {
  redirect('/dashboard');
}

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  category: z.enum(['Poetry', 'Tradition', 'Drama', 'Reading', 'Folding'], {
    errorMap: () => ({ message: 'Please select a valid category.' }),
  }),
  year: z.coerce
    .number()
    .int()
    .min(1000, { message: 'Year must be a valid year' })
    .max(new Date().getFullYear(), { message: 'Year cannot be in the future' }),
  description: z.string().min(1, { message: 'Description is required' }),
  filePath: z.string().min(1, { message: 'File path is required' }).refine(val => val.startsWith('/pdfs/'), {
    message: 'File path must start with /pdfs/',
  }),
  comment: z.string().optional(),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    author?: string[];
    category?: string[];
    year?: string[];
    description?: string[];
    filePath?: string[];
    comment?: string[];
  };
};

async function handleBookAction(book: Book, action: 'create' | 'update') {
  const validatedFields = bookSchema.safeParse(book);

  if (!validatedFields.success) {
    return {
      message: 'Failed to save book. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    if (action === 'create') {
      await addBook(validatedFields.data as Omit<Book, 'id'>);
    } else {
      await updateBook(validatedFields.data as Book);
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to save book.',
    };
  }

  revalidatePath('/dashboard/books');
  revalidatePath('/dashboard');
  return { message: `Book successfully ${action === 'create' ? 'added' : 'updated'}.`, errors: {} };
}

export async function createBookAction(prevState: FormState, formData: FormData) {
  const book = Object.fromEntries(formData.entries());
  return handleBookAction(book as unknown as Book, 'create');
}

export async function updateBookAction(prevState: FormState, formData: FormData) {
  const book = Object.fromEntries(formData.entries());
  return handleBookAction(book as unknown as Book, 'update');
}

export async function deleteBookAction(id: string) {
  try {
    await deleteBook(id);
    revalidatePath('/dashboard/books');
    revalidatePath('/dashboard');
    return { message: 'Book deleted successfully.' };
  } catch (error) {
    return { message: 'Database Error: Failed to delete book.' };
  }
}

// Planner 1 Actions
export async function getPlanner1ItemsAction(): Promise<Planner1Item[]> {
  return getPlanner1Items();
}

export async function savePlanner1ItemsAction(items: Planner1Item[]): Promise<{success: boolean}> {
  try {
    await savePlanner1Items(items);
    revalidatePath('/dashboard/planner');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 1 items:', error);
    return { success: false };
  }
}

// Planner 2 Actions
export async function getPlanner2ItemsAction(): Promise<Planner2Item[]> {
  return getPlanner2Items();
}

export async function savePlanner2ItemsAction(items: Planner2Item[]): Promise<{success: boolean}> {
  try {
    await savePlanner2Items(items);
    revalidatePath('/dashboard/planner-2');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 2 items:', error);
    return { success: false };
  }
}
