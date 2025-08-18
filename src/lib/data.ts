'use server';

import type { Book, Planner1Item, Planner2Item } from './definitions';
import fs from 'fs/promises';
import path from 'path';

// --- BOOK DATA ---
const booksDbPath = path.join(process.cwd(), 'src', 'lib', 'books.json');
let books: Book[] | null = null;

async function readBooksDb(): Promise<Book[]> {
  if (books) return books;
  try {
    const data = await fs.readFile(booksDbPath, 'utf-8');
    books = JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      books = [];
      await writeBooksDb(books);
    } else {
      throw error;
    }
  }
  return books!;
}

async function writeBooksDb(data: Book[]) {
  books = data;
  await fs.writeFile(booksDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- PLANNER 1 DATA ---
const planner1DbPath = path.join(process.cwd(), 'src', 'lib', 'planner1.json');
let planner1Items: Planner1Item[] | null = null;

async function readPlanner1Db(): Promise<Planner1Item[]> {
    if (planner1Items) return planner1Items;
    try {
        const data = await fs.readFile(planner1DbPath, 'utf-8');
        planner1Items = JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            planner1Items = [];
            await writePlanner1Db(planner1Items);
        } else {
            throw error;
        }
    }
    return planner1Items!;
}

async function writePlanner1Db(data: Planner1Item[]) {
    planner1Items = data;
    await fs.writeFile(planner1DbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- PLANNER 2 DATA ---
const planner2DbPath = path.join(process.cwd(), 'src', 'lib', 'planner2.json');
let planner2Items: Planner2Item[] | null = null;

async function readPlanner2Db(): Promise<Planner2Item[]> {
    if (planner2Items) return planner2Items;
    try {
        const data = await fs.readFile(planner2DbPath, 'utf-8');
        planner2Items = JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            planner2Items = [];
            await writePlanner2Db(planner2Items);
        } else {
            throw error;
        }
    }
    return planner2Items!;
}

async function writePlanner2Db(data: Planner2Item[]) {
    planner2Items = data;
    await fs.writeFile(planner2DbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- EXPORTED FUNCTIONS ---

// Book Functions
export async function getBooks(): Promise<Book[]> {
  await delay(500);
  return await readBooksDb();
}

export async function getBookById(id: string): Promise<Book | undefined> {
  await delay(200);
  const allBooks = await readBooksDb();
  return allBooks.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  await delay(300);
  const allBooks = await readBooksDb();
  const newBook: Book = {
    id: (Math.max(0, ...allBooks.map(b => parseInt(b.id, 10))) + 1).toString(),
    ...book,
  };
  const updatedBooks = [...allBooks, newBook];
  await writeBooksDb(updatedBooks);
  return newBook;
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  await delay(300);
  let allBooks = await readBooksDb();
  const index = allBooks.findIndex((book) => book.id === updatedBook.id);
  if (index !== -1) {
    allBooks[index] = updatedBook;
    await writeBooksDb(allBooks);
    return allBooks[index];
  }
  return null;
}

export async function deleteBook(id: string): Promise<boolean> {
  await delay(300);
  let allBooks = await readBooksDb();
  const initialLength = allBooks.length;
  const updatedBooks = allBooks.filter((book) => book.id !== id);
  if (updatedBooks.length < initialLength) {
    await writeBooksDb(updatedBooks);
    return true;
  }
  return false;
}

// Planner 1 Functions
export async function getPlanner1Items(): Promise<Planner1Item[]> {
    await delay(300);
    return await readPlanner1Db();
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    await delay(300);
    await writePlanner1Db(items);
}


// Planner 2 Functions
export async function getPlanner2Items(): Promise<Planner2Item[]> {
    await delay(300);
    return await readPlanner2Db();
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    await delay(300);
    await writePlanner2Db(items);
}