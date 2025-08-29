
'use server';

import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';
import fs from 'fs/promises';
import path from 'path';

const booksPath = path.join(process.cwd(), 'src', 'lib', 'books.json');
const planner1Path = path.join(process.cwd(), 'src/lib/planner1.json');
const planner2Path = path.join(process.cwd(), 'src/lib/planner2.json');
const plannerSignaturesPath = path.join(process.cwd(), 'src/lib/planner-signatures.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, return a default value based on the file path
      if (filePath.includes('signatures')) return {} as T;
      return [] as T;
    }
    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- BOOK FUNCTIONS ---

export async function getBooks(): Promise<Book[]> {
  return await readJsonFile<Book[]>(booksPath);
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getBooks();
  return books.find(book => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  const books = await getBooks();
  const newBook: Book = { ...book, id: Date.now().toString() };
  books.push(newBook);
  await writeJsonFile(booksPath, books);
  return newBook;
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  const books = await getBooks();
  const index = books.findIndex(b => b.id === updatedBook.id);
  if (index === -1) return null;
  books[index] = updatedBook;
  await writeJsonFile(booksPath, books);
  return updatedBook;
}

export async function deleteBook(id: string): Promise<boolean> {
  const books = await getBooks();
  const initialLength = books.length;
  const updatedBooks = books.filter(book => book.id !== id);
  if (updatedBooks.length === initialLength) return false;
  await writeJsonFile(booksPath, updatedBooks);
  return true;
}

// --- PLANNER 1 FUNCTIONS ---

export async function getPlanner1Items(): Promise<Planner1Item[]> {
  return await readJsonFile<Planner1Item[]>(planner1Path);
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
  await writeJsonFile(planner1Path, items);
}

// --- PLANNER SIGNATURES FUNCTIONS ---

export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
  const allSignatures = await readJsonFile<Record<number, Omit<PlannerSignatures, 'year'>>>(plannerSignaturesPath);
  return allSignatures[year] || null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
  const allSignatures = await readJsonFile<Record<number, Omit<PlannerSignatures, 'year'>>>(plannerSignaturesPath);
  const { year, ...rest } = signatures;
  allSignatures[year] = rest;
  await writeJsonFile(plannerSignaturesPath, allSignatures);
}

// --- PLANNER 2 FUNCTIONS ---

export async function getPlanner2Items(): Promise<Planner2Item[]> {
  return await readJsonFile<Planner2Item[]>(planner2Path);
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
  await writeJsonFile(planner2Path, items);
}
