
'use server';

import { list, put, del, head } from '@vercel/blob';
import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';

// --- HELPER FUNCTIONS ---

// Generic function to read a JSON file from Vercel Blob
async function readData<T>(fileName: string): Promise<T[]> {
  try {
    const blob = await head(fileName, {
        token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // The public URL doesn't need a token
    const response = await fetch(blob.url);
     if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);
    }
    const data = await response.json();
    return (data as T[]) || [];
  } catch (error: any) {
    if (error?.status === 404 || error.message.includes('404')) {
        // If the file doesn't exist, create it with an empty array
        await writeData(fileName, []);
        return [];
    }
    console.error(`Error reading data from ${fileName}:`, error);
    // Return empty array on error to prevent app crash
    return [];
  }
}


// Generic function to write a JSON file to Vercel Blob
async function writeData<T>(fileName: string, data: T[]): Promise<void> {
  await put(fileName, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false, // Ensures we overwrite the same file
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}


// --- EXPORTED FUNCTIONS ---

// Book Functions
export async function getBooks(): Promise<Book[]> {
  return readData<Book>('books.json');
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  const books = await getBooks();
  const newBook: Book = {
    id: (Math.max(0, ...books.map(b => parseInt(b.id, 10) || 0)) + 1).toString(),
    ...book,
  };
  const updatedBooks = [...books, newBook];
  await writeData('books.json', updatedBooks);
  return newBook;
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  let books = await getBooks();
  const index = books.findIndex(book => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    await writeData('books.json', books);
    return updatedBook;
  }
  return null;
}

export async function deleteBook(id: string): Promise<boolean> {
  let books = await getBooks();
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  if (books.length < initialLength) {
    await writeData('books.json', books);
    return true;
  }
  return false;
}

// Planner 1 Functions
export async function getPlanner1Items(): Promise<Planner1Item[]> {
    return readData<Planner1Item>('planner1.json');
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    await writeData('planner1.json', items);
}

// Planner Signatures Functions
export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    const allSignatures = await readData<PlannerSignatures>('planner-signatures.json');
    const signatures = allSignatures.find(sig => sig.year === year);
    if (signatures) {
        return { preparationOfficer: signatures.preparationOfficer, reviewOfficer: signatures.reviewOfficer };
    }
    return null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    let allSignatures = await readData<PlannerSignatures>('planner-signatures.json');
    const index = allSignatures.findIndex(sig => sig.year === signatures.year);
    if (index !== -1) {
        allSignatures[index] = signatures;
    } else {
        allSignatures.push(signatures);
    }
    await writeData('planner-signatures.json', allSignatures);
}

// Planner 2 Functions
export async function getPlanner2Items(): Promise<Planner2Item[]> {
    return readData<Planner2Item>('planner2.json');
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    await writeData('planner2.json', items);
}

// PDF Upload function for Vercel Blob
export async function uploadPdfToBlob(file: File): Promise<{ success: boolean; path?: string; error?: string }> {
  if (!file || file.type !== 'application/pdf') {
      return { success: false, error: 'Invalid file type. Please upload a PDF.' };
  }

  try {
      const blob = await put(file.name, file, {
          access: 'public',
          contentType: 'application/pdf',
          token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return { success: true, path: blob.url };
  } catch (error) {
      console.error('File upload to Blob failed:', error);
      return { success: false, error: 'An unexpected error occurred during file upload.' };
  }
}
