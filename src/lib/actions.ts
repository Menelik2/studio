
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Book, PlannerItem, Planner2Item, PlannerSignatures } from './definitions';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, query } from 'firebase/firestore';
import { readData, writeData } from './blob'; // Keep for planners for now

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
    const newDocRef = doc(collection(db, "books"));
    const newBook: Book = {
      id: newDocRef.id,
      ...validatedFields.data,
      comment: validatedFields.data.comment || '',
      filePath: validatedFields.data.filePath || '',
    };
    await setDoc(newDocRef, newBook);
  } catch (error) {
    console.error("Error creating book in Firestore:", error);
    return {
      message: 'Database Error: Failed to save book to Firestore.',
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
  
  const { id, ...bookData } = validatedFields.data;
  const finalData: Book = {
    id,
    ...bookData,
    comment: bookData.comment || '',
    filePath: bookData.filePath || '',
  };

  try {
    const bookRef = doc(db, 'books', id);
    await setDoc(bookRef, finalData, { merge: true });

  } catch (error) {
    console.error("Error updating book in Firestore:", error);
    return {
      message: 'Database Error: Failed to save book update to Firestore.',
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
    await deleteDoc(doc(db, 'books', id));
    
    revalidatePath('/dashboard/books');
    revalidatePath('/dashboard');
    return { message: 'Book deleted successfully.' };
  } catch (error) {
    console.error("Error deleting book from Firestore:", error);
    return { message: 'Database Error: Failed to delete book from Firestore.' };
  }
}

export async function getBooksAction(): Promise<Book[]> {
    try {
        const booksCol = collection(db, 'books');
        const booksSnapshot = await getDocs(booksCol);
        const booksList = booksSnapshot.docs.map(doc => doc.data() as Book);
        return booksList;
    } catch (error) {
        console.error("Error fetching books from Firestore:", error);
        return [];
    }
}

export async function getBookById(id: string): Promise<Book | undefined> {
    try {
        const bookRef = doc(db, 'books', id);
        const bookSnap = await getDoc(bookRef);
        if (bookSnap.exists()) {
            return bookSnap.data() as Book;
        }
        return undefined;
    } catch(error) {
        console.error("Error fetching book by ID from Firestore:", error);
        return undefined;
    }
}


export async function uploadPdfAction(formData: FormData) {
    const { put } = await import('@vercel/blob');
    const { BLOB_READ_WRITE_TOKEN } = await import('./env');

    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided.' };
    }
    
    try {
        const blob = await put(file.name, file, {
          access: 'public',
          token: BLOB_READ_WRITE_TOKEN,
        });
        return { success: true, path: blob.url };
    } catch (error: any) {
         return { success: false, error: `Error uploading file: ${error.message}` };
    }
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
