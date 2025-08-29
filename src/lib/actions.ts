
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
<<<<<<< HEAD
    comment: validatedFields.data.comment || '',
  }
=======
    comment: validatedFields.data.comment || ''
  };

>>>>>>> refs/remotes/origin/main

  try {
    let updatedBooks;
    if (action === 'create') {
<<<<<<< HEAD
      updatedBooks = await addBookToFile(finalData as Omit<Book, 'id'>);
    } else {
      updatedBooks = await updateBookFromFile(finalData as Book);
    }
    // Sync with Vercel Blob
    if (process.env.VERCEL_ENV) {
      await writeDataToBlob('books.json', updatedBooks);
=======
      await addBook(finalData as Omit<Book, 'id'>);
    } else {
      await updateBook(finalData as Book);
>>>>>>> refs/remotes/origin/main
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
<<<<<<< HEAD
    const updatedBooks = await deleteBookFromFile(id);
    if(updatedBooks && process.env.VERCEL_ENV) {
      await writeDataToBlob('books.json', updatedBooks);
=======
    const deleted = await deleteBook(id);
    if (!deleted) {
      return { message: 'Error: Book not found for deletion.' };
>>>>>>> refs/remotes/origin/main
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
<<<<<<< HEAD
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided.' };
=======
    const file = formData.get('file') as File;
    if (!file || file.type !== 'application/pdf') {
        return { success: false, error: 'Invalid file type. Please upload a PDF.' };
    }

    try {
        const publicDir = path.join(process.cwd(), 'public', 'pdfs');
        await fs.mkdir(publicDir, { recursive: true });

        const sanitizedFilename = path.basename(file.name).replace(/[^a-z0-9_.\-]/gi, '_');
        const filePath = path.join(publicDir, sanitizedFilename);
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        const relativePath = `/pdfs/${sanitizedFilename}`;
        return { success: true, path: relativePath };

    } catch (error) {
        console.error('File upload failed:', error);
        return { success: false, error: 'An unexpected error occurred during file upload.' };
>>>>>>> refs/remotes/origin/main
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
