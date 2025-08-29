
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Book, PlannerItem, Planner2Item, PlannerSignatures } from './definitions';

// --- Local File System Functions ---

const dataDirectory = path.join(process.cwd(), 'src/lib');

async function readLocalData<T>(fileName: string): Promise<T[]> {
  try {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeLocalData(fileName, []);
      return [];
    }
    console.error(`Error reading local file ${fileName}:`, error);
    return [];
  }
}

async function writeLocalData<T>(fileName: string, data: T[]): Promise<void> {
  const filePath = path.join(dataDirectory, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- Book Data Access ---
export async function getBooks(): Promise<Book[]> {
  return readLocalData<Book>('books.json');
}

export async function saveBooks(books: Book[]): Promise<void> {
  await writeLocalData('books.json', books);
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book[]> {
  const books = await getBooks();
  const newBook: Book = {
    id: (Math.max(0, ...books.map(b => parseInt(b.id, 10) || 0)) + 1).toString(),
    ...book,
  };
  const updatedBooks = [...books, newBook];
  await saveBooks(updatedBooks);
  return updatedBooks;
}

export async function updateBook(updatedBook: Book): Promise<Book[] | null> {
  let books = await getBooks();
  const index = books.findIndex(book => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    await saveBooks(books);
    return books;
  }
  return null;
}

export async function deleteBook(id: string): Promise<Book[] | false> {
  let books = await getBooks();
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  if (books.length < initialLength) {
    await saveBooks(books);
    return books;
  }
  return false;
}

// --- Planner 1 ---
export async function getPlanner1Items(): Promise<Planner1Item[]> {
    return readLocalData<Planner1Item>('planner1.json');
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    await writeLocalData('planner1.json', items);
}

// --- Planner 2 ---
export async function getPlanner2Items(): Promise<Planner2Item[]> {
    return readLocalData<Planner2Item>('planner2.json');
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    await writeLocalData('planner2.json', items);
}

// --- Planner Signatures ---
export async function getPlannerSignatures(): Promise<PlannerSignatures[]> {
    return readLocalData<PlannerSignatures>('planner-signatures.json');
}

export async function savePlannerSignatures(signatures: PlannerSignatures[]): Promise<void> {
    await writeLocalData('planner-signatures.json', signatures);
}
