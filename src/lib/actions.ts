
// @ts-nocheck
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { 
  addBook as addBookToFile, 
  deleteBook as deleteBookFromFile, 
  updateBook as updateBookFromFile,
  getBooks,
  saveBooks,
  getPlanner1Items, 
  savePlanner1Items,
  getPlanner2Items,
  savePlanner2Items,
  getPlannerSignatures,
  savePlannerSignatures,
  uploadPdfToBlob as uploadPdfToVercelBlob,
  readDataFromBlob,
  writeDataToBlob
} from './data';
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

const bookSchema = z.object({
  id: z.string().optional(),
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
  filePath: z.string().min(1, { message: 'File path is required' }).refine(val => val.startsWith('https://') || val.startsWith('http://'), {
    message: 'A valid URL is required. Please upload a file to get a URL.',
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
  if (book.filePath && book.filePath.startsWith('https://')) {
    try {
      const url = new URL(book.filePath);
      book.filePath = url.pathname;
    } catch (e) {
      // Ignore if it's not a valid URL, validation will catch it.
    }
  }
  const validatedFields = bookSchema.safeParse(book);

  if (!validatedFields.success) {
    return {
      message: 'Failed to save book. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const finalData = {
    ...validatedFields.data,
    comment: validatedFields.data.comment || '',
  }

  try {
    let updatedBooks;
    if (action === 'create') {
      updatedBooks = await addBookToFile(finalData as Omit<Book, 'id'>);
    } else {
      updatedBooks = await updateBookFromFile(finalData as Book);
    }
    // Sync with Vercel Blob
    if (process.env.VERCEL_ENV) {
      await writeDataToBlob('books.json', updatedBooks);
    }
  } catch (error) {
    console.error("Error handling book action:", error);
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

export async function deleteBookAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  try {
    const updatedBooks = await deleteBookFromFile(id);
    if(updatedBooks && process.env.VERCEL_ENV) {
      await writeDataToBlob('books.json', updatedBooks);
    }
    revalidatePath('/dashboard/books');
    revalidatePath('/dashboard');
    return { message: 'Book deleted successfully.' };
  } catch (error) {
    return { message: 'Database Error: Failed to delete book.' };
  }
}

export async function getBooksAction(): Promise<Book[]> {
  // On Vercel, sync from blob first
  if (process.env.VERCEL_ENV) {
    const blobData = await readDataFromBlob<Book>('books.json');
    await saveBooks(blobData);
  }
  return getBooks();
}


export async function uploadPdfAction(formData: FormData) {
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided.' };
    }
    // This function can only be used on the server, so it's safe here
    return uploadPdfToVercelBlob(file);
}


// Planner 1 Actions
export async function getPlanner1ItemsAction(): Promise<Planner1Item[]> {
  if (process.env.VERCEL_ENV) {
    const blobData = await readDataFromBlob<Planner1Item>('planner1.json');
    await savePlanner1Items(blobData);
  }
  return getPlanner1Items();
}

export async function savePlanner1ItemsAction(items: Planner1Item[]): Promise<{success: boolean}> {
  try {
    await savePlanner1Items(items); // save to local file
    if (process.env.VERCEL_ENV) {
      await writeDataToBlob('planner1.json', items);
    }
    revalidatePath('/dashboard/planner');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 1 items:', error);
    return { success: false };
  }
}

export async function getPlannerSignaturesAction(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    if (process.env.VERCEL_ENV) {
      const blobData = await readDataFromBlob<PlannerSignatures>('planner-signatures.json');
      await savePlannerSignatures(blobData);
    }
    const allSignatures = await getPlannerSignatures();
    const signatures = allSignatures.find(sig => sig.year === year);
    if (signatures) {
        return { preparationOfficer: signatures.preparationOfficer, reviewOfficer: signatures.reviewOfficer };
    }
    return null;
}

export async function savePlannerSignaturesAction(signatures: PlannerSignatures): Promise<{success: boolean}> {
    try {
        let allSignatures = await getPlannerSignatures();
        const index = allSignatures.findIndex(sig => sig.year === signatures.year);
        if (index !== -1) {
            allSignatures[index] = signatures;
        } else {
            allSignatures.push(signatures);
        }
        await savePlannerSignatures(allSignatures); // save to local file
        if (process.env.VERCEL_ENV) {
            await writeDataToBlob('planner-signatures.json', allSignatures);
        }
        revalidatePath('/dashboard/planner');
        return { success: true };
    } catch (error) {
        console.error('Failed to save planner signatures:', error);
        return { success: false };
    }
}


// Planner 2 Actions
export async function getPlanner2ItemsAction(): Promise<Planner2Item[]> {
    if (process.env.VERCEL_ENV) {
        const blobData = await readDataFromBlob<Planner2Item>('planner2.json');
        await savePlanner2Items(blobData);
    }
    return getPlanner2Items();
}

export async function savePlanner2ItemsAction(items: Planner2Item[]): Promise<{success:boolean}> {
  try {
    await savePlanner2Items(items); // save to local file
    if (process.env.VERCEL_ENV) {
        await writeDataToBlob('planner2.json', items);
    }
    revalidatePath('/dashboard/planner-2');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 2 items:', error);
    return { success: false };
  }
}
