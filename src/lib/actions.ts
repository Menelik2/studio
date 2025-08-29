
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
  getPlanner1Items as getLocalPlanner1Items, 
  savePlanner1Items as saveLocalPlanner1Items,
  getPlanner2Items as getLocalPlanner2Items,
  savePlanner2Items as saveLocalPlanner2Items,
  getPlannerSignatures as getLocalPlannerSignatures,
  savePlannerSignatures as saveLocalPlannerSignatures,
} from './data';
import { readDataFromBlob, writeDataToBlob, uploadPdfToBlob } from './blob';
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
  filePath: z.string().url({ message: 'A valid URL is required. Please upload a file to get a URL.' }),
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

async function handleBookAction(bookData: unknown, action: 'create' | 'update') {
  const schema = action === 'create' ? createBookSchema : updateBookSchema;
  const validatedFields = schema.safeParse(bookData);

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
    if (process.env.VERCEL_ENV && updatedBooks) {
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
  const rawData = Object.fromEntries(formData.entries());
  // The ID from the form will be an empty string for new books, so we remove it.
  if (rawData.id === '') {
    delete rawData.id;
  }
  return handleBookAction(rawData, 'create');
}

export async function updateBookAction(prevState: FormState, formData: FormData) {
  const book = Object.fromEntries(formData.entries());
  return handleBookAction(book, 'update');
}

export async function deleteBookAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) {
    return { message: 'Error: Book ID is missing.' };
  }
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
    if (blobData) {
        await saveBooks(blobData);
    }
  }
  return getBooks();
}


export async function uploadPdfAction(formData: FormData) {
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided.' };
    }
    // This function can only be used on the server, so it's safe here
    return uploadPdfToBlob(file);
}


// Planner 1 Actions
export async function getPlanner1ItemsAction(): Promise<Planner1Item[]> {
  if (process.env.VERCEL_ENV) {
    const blobData = await readDataFromBlob<Planner1Item>('planner1.json');
    if (blobData) {
        await saveLocalPlanner1Items(blobData);
    }
  }
  return getLocalPlanner1Items();
}

export async function savePlanner1ItemsAction(items: Planner1Item[]): Promise<{success: boolean}> {
  try {
    await saveLocalPlanner1Items(items); // save to local file
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
      if (blobData) {
          await saveLocalPlannerSignatures(blobData);
      }
    }
    const allSignatures = await getLocalPlannerSignatures();
    const signatures = allSignatures.find(sig => sig.year === year);
    if (signatures) {
        return { preparationOfficer: signatures.preparationOfficer, reviewOfficer: signatures.reviewOfficer };
    }
    return null;
}

export async function savePlannerSignaturesAction(signatures: PlannerSignatures): Promise<{success: boolean}> {
    try {
        let allSignatures = await getLocalPlannerSignatures();
        const index = allSignatures.findIndex(sig => sig.year === signatures.year);
        if (index !== -1) {
            allSignatures[index] = signatures;
        } else {
            allSignatures.push(signatures);
        }
        await saveLocalPlannerSignatures(allSignatures); // save to local file
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
        if (blobData) {
            await saveLocalPlanner2Items(blobData);
        }
    }
    return getLocalPlanner2Items();
}

export async function savePlanner2ItemsAction(items: Planner2Item[]): Promise<{success:boolean}> {
  try {
    await saveLocalPlanner2Items(items); // save to local file
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
