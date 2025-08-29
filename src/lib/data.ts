
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';

// Define paths to the JSON files
const booksFilePath = path.join(process.cwd(), 'src', 'lib', 'books.json');
const planner1FilePath = path.join(process.cwd(), 'src', 'lib', 'planner1.json');
const planner2FilePath = path.join(process.cwd(), 'src', 'lib', 'planner2.json');
const signaturesFilePath = path.join(process.cwd(), 'src', 'lib', 'planner-signatures.json');

// --- UTILITY FUNCTIONS ---

async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array or object
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      if (filePath.endsWith('-signatures.json')) {
        return {} as T;
      }
      return [] as T;
    }
    console.error(`Error reading from ${filePath}:`, error);
    throw new Error('Could not read data file.');
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    throw new Error('Could not write to data file.');
  }
}


// --- BOOK FUNCTIONS ---

export async function getBooks(): Promise<Book[]> {
  return await readJsonFile<Book[]>(booksFilePath);
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find(book => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  const books = await getBooks();
  const newBook: Book = {
    id: new Date().getTime().toString(), // Simple unique ID generation
    ...book
  };
  const updatedBooks = [...books, newBook];
  await writeJsonFile(booksFilePath, updatedBooks);
  return newBook;
}

export async function updateBook(bookData: Book): Promise<Book> {
  const books = await getBooks();
  const index = books.findIndex(b => b.id === bookData.id);
  if (index === -1) {
    throw new Error('Book not found');
  }
  books[index] = { ...books[index], ...bookData };
  await writeJsonFile(booksFilePath, books);
  return books[index];
}

export async function deleteBook(id: string): Promise<boolean> {
  const books = await getBooks();
  const updatedBooks = books.filter(b => b.id !== id);
  if (books.length === updatedBooks.length) {
    return false; // Book not found
  }
  await writeJsonFile(booksFilePath, updatedBooks);
  return true;
}


// --- PLANNER 1 FUNCTIONS ---

export async function getPlanner1Items(): Promise<Planner1Item[]> {
  return await readJsonFile<Planner1Item[]>(planner1FilePath);
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
  await writeJsonFile(planner1FilePath, items);
}

// --- PLANNER SIGNATURES FUNCTIONS ---

async function getAllSignatures(): Promise<Record<number, Omit<PlannerSignatures, 'year'>>> {
    return await readJsonFile<Record<number, Omit<PlannerSignatures, 'year'>>>(signaturesFilePath);
}

export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    const allSignatures = await getAllSignatures();
    return allSignatures[year] || null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    const allSignatures = await getAllSignatures();
    const { year, ...rest } = signatures;
    allSignatures[year] = rest;
    await writeJsonFile(signaturesFilePath, allSignatures);
}


// --- PLANNER 2 FUNCTIONS ---

export async function getPlanner2Items(): Promise<Planner2Item[]> {
  return await readJsonFile<Planner2Item[]>(planner2FilePath);
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
  await writeJsonFile(planner2FilePath, items);
}
