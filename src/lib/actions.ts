
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { readData, writeData, uploadPdfToBlob } from './blob';
import type { Book, PlannerItem, Planner2Item, PlannerSignatures } from './definitions';

// Mock login action
export async function loginAction(prevState: { error: string } | undefined, formData: FormData) {
  const password = formData.get('password');
  
  if (password === '123!@#admin') {
    redirect('/dashboard');
  } else {
    return { error: 'Invalid password. Please try again.' };
  }
}

const bookSchemaBase = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት'], {
    errorMap: () => ({ message: 'Please select a valid category.' }),
  }),
  year: z.coerce
    .number()
    .int()
    .min(1000, { message: 'Year must be a valid year' })
    .max(new Date().getFullYear(), { message: 'Year cannot be in the future' }),
  description: z.string().min(1, { message: 'Description is required' }),
  filePath: z.string().url({ message: 'A valid PDF URL is required.' }).or(z.literal('')),
  comment: z.string().optional(),
});

const createBookSchema = bookSchemaBase;
const updateBookSchema = bookSchemaBase.extend({
  id: z.string().min(1, { message: 'ID is required for updates' }),
});


export type FormState = {
  message: string;
  errors?: {
    id?: string[];
    title?: string[];
    author?: string[];
    category?: string[];
    year?: string[];
    description?: string[];
    filePath?: string[];
    comment?: string[];
  };
};

export async function createBookAction(prevState: FormState, rawData: unknown): Promise<FormState> {
  const validatedFields = createBookSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Failed to create book. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const books = await getBooksAction();
    const newBook: Book = {
      id: (Math.max(0, ...books.map(b => parseInt(b.id, 10) || 0)) + 1).toString(),
      ...validatedFields.data,
      comment: validatedFields.data.comment || '',
      filePath: validatedFields.data.filePath || '',
    };
    books.push(newBook);
    await writeData('books.json', books);
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      message: 'Database Error: Failed to save book.',
    };
  }

  revalidatePath('/dashboard/books');
  revalidatePath('/dashboard');
  return { message: 'Book successfully added.', errors: {} };
}

export async function updateBookAction(prevState: FormState, rawData: unknown): Promise<FormState> {
  const validatedFields = updateBookSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Failed to update book. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const finalData = {
    ...validatedFields.data,
    comment: validatedFields.data.comment || '',
    filePath: validatedFields.data.filePath || '',
  };

  try {
    let books = await getBooksAction();
    const index = books.findIndex(book => book.id === finalData.id);

    if (index !== -1) {
      books[index] = finalData;
      await writeData('books.json', books);
    } else {
      throw new Error('Book not found for update');
    }
  } catch (error) {
    console.error("Error updating book:", error);
    return {
      message: 'Database Error: Failed to save book.',
    };
  }

  revalidatePath('/dashboard/books');
  revalidatePath('/dashboard');
  return { message: 'Book successfully updated.', errors: {} };
}


export async function deleteBookAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) {
    return { message: 'Error: Book ID is missing.' };
  }
  try {
    let books = await getBooksAction();
    const initialLength = books.length;
    books = books.filter(book => book.id !== id);
    if (books.length < initialLength) {
        await writeData('books.json', books);
    }
    revalidatePath('/dashboard/books');
    revalidatePath('/dashboard');
    return { message: 'Book deleted successfully.' };
  } catch (error) {
    return { message: 'Database Error: Failed to delete book.' };
  }
}

export async function getBooksAction(): Promise<Book[]> {
    return readData<Book>('books.json');
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooksAction();
  return books.find((book) => book.id === id);
}


export async function uploadPdfAction(formData: FormData) {
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided.' };
    }
    return uploadPdfToBlob(file);
}


// Planner 1 Actions
export async function getPlanner1ItemsAction(): Promise<PlannerItem[]> {
  return readData<PlannerItem>('planner1.json');
}

export async function savePlanner1ItemsAction(items: PlannerItem[]): Promise<{success: boolean}> {
  try {
    await writeData('planner1.json', items);
    revalidatePath('/dashboard/planner');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 1 items:', error);
    return { success: false };
  }
}

export async function getPlannerSignaturesAction(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    const allSignatures = await readData<PlannerSignatures>('planner-signatures.json');
    const signatures = allSignatures.find(sig => sig.year === year);
    if (signatures) {
        return { preparationOfficer: signatures.preparationOfficer, reviewOfficer: signatures.reviewOfficer };
    }
    return null;
}

export async function savePlannerSignaturesAction(signatures: PlannerSignatures): Promise<{success: boolean}> {
    try {
        let allSignatures = await readData<PlannerSignatures>('planner-signatures.json');
        const index = allSignatures.findIndex(sig => sig.year === signatures.year);
        if (index !== -1) {
            allSignatures[index] = signatures;
        } else {
            allSignatures.push(signatures);
        }
        await writeData('planner-signatures.json', allSignatures);
        revalidatePath('/dashboard/planner');
        return { success: true };
    } catch (error) {
        console.error('Failed to save planner signatures:', error);
        return { success: false };
    }
}


// Planner 2 Actions
export async function getPlanner2ItemsAction(): Promise<Planner2Item[]> {
    return readData<Planner2Item>('planner2.json');
}

export async function savePlanner2ItemsAction(items: Planner2Item[]): Promise<{success:boolean}> {
  try {
    await writeData('planner2.json', items);
    revalidatePath('/dashboard/planner-2');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 2 items:', error);
    return { success: false };
  }
}
