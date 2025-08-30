
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Book, PlannerItem, Planner2Item, PlannerSignatures } from './definitions';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, writeBatch } from 'firebase/firestore';
import { put } from '@vercel/blob';

// Mock login action
export async function loginAction(prevState: { error?: string } | undefined, formData: FormData) {
  const password = formData.get('password');
  
  // This is a mock authentication. In a real app, use a proper auth service.
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

// Schema for creating a new book. ID is not needed.
const createBookSchema = bookSchemaBase;

// Schema for updating. ID is required. All other fields are passed through.
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

export async function createBookAction(rawData: unknown): Promise<FormState> {
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

export async function updateBookAction(rawData: unknown): Promise<FormState> {
  const validatedFields = updateBookSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Failed to update book. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, ...bookData } = validatedFields.data;

  try {
    const bookRef = doc(db, 'books', id);
    // Use `setDoc` with `merge: true` to update fields or create if it doesn't exist.
    // This is safer and also handles partial updates (like just a comment) gracefully.
    await setDoc(bookRef, bookData, { merge: true });

  } catch (error) {
    console.error("Error updating book in Firestore:", error);
    return {
      message: 'Database Error: Failed to save book update to Firestore.',
    };
  }

  revalidatePath('/dashboard/books');
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/books/${id}`);
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
        // Sort books by title alphabetically
        booksList.sort((a, b) => a.title.localeCompare(b.title));
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
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided.' };
    }
    
    try {
        const blob = await put(file.name, file, {
          access: 'public',
        });
        return { success: true, path: blob.url };
    } catch (error: any) {
         return { success: false, error: `Error uploading file: ${error.message}` };
    }
}

// ===============================================
// Planner 1 Actions
// ===============================================

export async function getPlanner1ItemsAction(): Promise<PlannerItem[]> {
  try {
    const itemsCol = collection(db, 'planner1');
    const itemsSnapshot = await getDocs(itemsCol);
    return itemsSnapshot.docs.map(doc => doc.data() as PlannerItem);
  } catch (error) {
    console.error("Error fetching planner1 items:", error);
    return [];
  }
}

export async function savePlanner1ItemsAction(items: PlannerItem[]): Promise<{ success: boolean }> {
  try {
    const batch = writeBatch(db);
    items.forEach(item => {
      const docRef = doc(db, 'planner1', item.id);
      batch.set(docRef, item);
    });
    
    await batch.commit();
    revalidatePath('/dashboard/planner');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 1 items:', error);
    return { success: false };
  }
}

export async function getPlannerSignaturesAction(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
  try {
    const docRef = doc(db, 'plannerSignatures', year.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as PlannerSignatures;
      return { preparationOfficer: data.preparationOfficer, reviewOfficer: data.reviewOfficer };
    }
    return null;
  } catch (error) {
    console.error('Error fetching signatures:', error);
    return null;
  }
}

export async function savePlannerSignaturesAction(signatures: PlannerSignatures): Promise<{ success: boolean }> {
  try {
    const docRef = doc(db, 'plannerSignatures', signatures.year.toString());
    await setDoc(docRef, signatures);
    revalidatePath('/dashboard/planner');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner signatures:', error);
    return { success: false };
  }
}


// ===============================================
// Planner 2 Actions
// ===============================================

export async function getPlanner2ItemsAction(): Promise<Planner2Item[]> {
  try {
    const itemsCol = collection(db, 'planner2');
    const itemsSnapshot = await getDocs(itemsCol);
    return itemsSnapshot.docs.map(doc => doc.data() as Planner2Item);
  } catch (error) {
    console.error("Error fetching planner2 items:", error);
    return [];
  }
}

export async function savePlanner2ItemsAction(items: Planner2Item[]): Promise<{ success: boolean }> {
  try {
    const batch = writeBatch(db);
    items.forEach(item => {
      const docRef = doc(db, 'planner2', item.id);
      batch.set(docRef, item);
    });

    await batch.commit();
    revalidatePath('/dashboard/planner-2');
    return { success: true };
  } catch (error) {
    console.error('Failed to save planner 2 items:', error);
    return { success: false };
  }
}
