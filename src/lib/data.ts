
'use server';

import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';
import fs from 'fs/promises';
import path from 'path';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const booksFilePath = path.join(process.cwd(), 'src/lib/books.json');
const planner1FilePath = path.join(process.cwd(), 'src/lib/planner1.json');
const planner2FilePath = path.join(process.cwd(), 'src/lib/planner2.json');
const plannerSignaturesFilePath = path.join(process.cwd(), 'src/lib/planner-signatures.json');


// --- HELPER FUNCTIONS ---
async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // Return empty array if file doesn't exist
    }
    console.error(`Error reading data from ${filePath}:`, error);
    throw new Error(`Could not read data from ${filePath}.`);
  }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    throw new Error(`Could not write data to ${filePath}.`);
  }
}


// --- EXPORTED FUNCTIONS ---

// Book Functions
export async function getBooks(): Promise<Book[]> {
  await delay(500);
  return readData<Book>(booksFilePath);
}

export async function getBookById(id: string): Promise<Book | undefined> {
  await delay(200);
  const books = await getBooks();
  return books.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  await delay(300);
  const books = await getBooks();
  const newBook: Book = {
    id: (Math.max(0, ...books.map(b => parseInt(b.id))) + 1).toString(),
    ...book,
  };
  const updatedBooks = [...books, newBook];
  await writeData(booksFilePath, updatedBooks);
  return newBook;
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  await delay(300);
  const books = await getBooks();
  const index = books.findIndex(book => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    await writeData(booksFilePath, books);
    return updatedBook;
  }
  return null;
}

export async function deleteBook(id: string): Promise<boolean> {
  await delay(300);
  let books = await getBooks();
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  if (books.length < initialLength) {
    await writeData(booksFilePath, books);
    return true;
  }
  return false;
}

// Planner 1 Functions
export async function getPlanner1Items(): Promise<Planner1Item[]> {
    await delay(300);
    return readData<Planner1Item>(planner1FilePath);
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    await delay(300);
    await writeData<Planner1Item>(planner1FilePath, items);
}

// Planner Signatures Functions
export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    await delay(200);
    const allSignatures = await readData<PlannerSignatures>(plannerSignaturesFilePath);
    const signatures = allSignatures.find(sig => sig.year === year);
    if (signatures) {
        return { preparationOfficer: signatures.preparationOfficer, reviewOfficer: signatures.reviewOfficer };
    }
    return null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    await delay(300);
    let allSignatures = await readData<PlannerSignatures>(plannerSignaturesFilePath);
    const index = allSignatures.findIndex(sig => sig.year === signatures.year);
    if (index !== -1) {
        allSignatures[index] = signatures;
    } else {
        allSignatures.push(signatures);
    }
    await writeData(plannerSignaturesFilePath, allSignatures);
}


// Planner 2 Functions
export async function getPlanner2Items(): Promise<Planner2Item[]> {
    await delay(300);
    return readData<Planner2Item>(planner2FilePath);
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    await delay(300);
    await writeData<Planner2Item>(planner2FilePath, items);
}
