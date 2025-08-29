
'use server';

import fs from 'fs/promises';
import path from 'path';
import { head, put, del, list } from '@vercel/blob';
import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';

// --- Vercel Blob Functions ---

// Generic function to read a JSON file from Vercel Blob
export async function readDataFromBlob<T>(fileName: string): Promise<T[]> {
  try {
    const blob = await head(fileName, {
        token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const response = await fetch(blob.url);
     if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);
    }
    const data = await response.json();
    return (data as T[]) || [];
  } catch (error: any) {
    if (error?.status === 404 || error.message.includes('404')) {
        // If the file doesn't exist in blob, create it with an empty array
        await writeDataToBlob(fileName, []);
        return [];
    }
    console.error(`Error reading data from ${fileName}:`, error);
    // Return empty array on error to prevent app crash
    return [];
  }
}


// Generic function to write a JSON file to Vercel Blob
export async function writeDataToBlob<T>(fileName: string, data: T[]): Promise<void> {
  await put(fileName, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false, // Ensures we overwrite the same file
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

// --- Local File System Functions ---

// Use a mock file system in development for simplicity
const dataDirectory = path.join(process.cwd(), 'src/lib');

async function readData<T>(fileName: string): Promise<T[]> {
  try {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData) as T[];
  } catch (error) {
    // If file doesn't exist, create it with empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeData(fileName, []);
      return [];
    }
    console.error(`Error reading local file ${fileName}:`, error);
    return [];
  }
}

async function writeData<T>(fileName: string, data: T[]): Promise<void> {
  const filePath = path.join(dataDirectory, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- EXPORTED DATA ACCESS FUNCTIONS ---

// Book Functions
export async function getBooks(): Promise<Book[]> {
  if (process.env.VERCEL_ENV) {
    return readDataFromBlob<Book>('books.json');
  }
  return readData<Book>('books.json');
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book[]> {
  const books = await readData<Book>('books.json');
  const newBook: Book = {
    id: (Math.max(0, ...books.map(b => parseInt(b.id, 10) || 0)) + 1).toString(),
    ...book,
  };
  const updatedBooks = [...books, newBook];
  await writeData('books.json', updatedBooks);
  return updatedBooks;
}

export async function updateBook(updatedBook: Book): Promise<Book[] | null> {
  let books = await readData<Book>('books.json');
  const index = books.findIndex(book => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    await writeData('books.json', books);
    return books;
  }
  return null;
}

export async function deleteBook(id: string): Promise<Book[] | false> {
  let books = await readData<Book>('books.json');
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  if (books.length < initialLength) {
    await writeData('books.json', books);
    return books;
  }
  return false;
}

// Planner 1 Functions
export async function getPlanner1Items(): Promise<Planner1Item[]> {
    if (process.env.VERCEL_ENV) {
      return readDataFromBlob<Planner1Item>('planner1.json');
    }
    return readData<Planner1Item>('planner1.json');
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    await writeData('planner1.json', items);
    await writeDataToBlob('planner1.json', items);
}

// Planner Signatures Functions
export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    const allSignatures = await getPlanner1Items(); // Placeholder, this needs its own file
    return null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    // Placeholder
}

// Planner 2 Functions
export async function getPlanner2Items(): Promise<Planner2Item[]> {
    if (process.env.VERCEL_ENV) {
      return readDataFromBlob<Planner2Item>('planner2.json');
    }
    return readData<Planner2Item>('planner2.json');
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    await writeData('planner2.json', items);
    await writeDataToBlob('planner2.json', items);
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
