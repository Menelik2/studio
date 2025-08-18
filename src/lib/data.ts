import type { Book } from './definitions';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file that will act as our database
const dbPath = path.join(process.cwd(), 'src', 'lib', 'books.json');

// In-memory cache of the database to avoid reading the file on every request
let books: Book[] | null = null;

// Initial data to seed the database if it doesn't exist
const initialData: Book[] = [
    {
    id: '1',
    title: 'Sonnets',
    author: 'William Shakespeare',
    category: 'Poetry',
    year: 1609,
    description: 'A collection of 154 sonnets by William Shakespeare.',
    filePath: '/pdfs/sonnets.pdf',
  },
  {
    id: '2',
    title: 'The Odyssey',
    author: 'Homer',
    category: 'Tradition',
    year: -800,
    description: 'An ancient Greek epic poem.',
    filePath: '/pdfs/odyssey.pdf',
  },
  {
    id: '3',
    title: 'Hamlet',
    author: 'William Shakespeare',
    category: 'Drama',
    year: 1603,
    description: 'A tragedy by William Shakespeare.',
    filePath: '/pdfs/hamlet.pdf',
  },
  {
    id: '4',
    title: 'Leaves of Grass',
    author: 'Walt Whitman',
    category: 'Poetry',
    year: 1855,
    description: 'A poetry collection by American poet Walt Whitman.',
    filePath: '/pdfs/leaves_of_grass.pdf',
  },
];

async function readDb(): Promise<Book[]> {
  if (books) return books;

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    books = JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, so we'll create it with initial data
      books = initialData;
      await writeDb(books);
    } else {
      throw error;
    }
  }
  return books!;
}

async function writeDb(data: Book[]) {
  books = data;
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getBooks(): Promise<Book[]> {
  await delay(500);
  return await readDb();
}

export async function getBookById(id: string): Promise<Book | undefined> {
  await delay(200);
  const allBooks = await readDb();
  return allBooks.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  await delay(300);
  const allBooks = await readDb();
  const newBook: Book = {
    id: (Math.max(0, ...allBooks.map(b => parseInt(b.id, 10))) + 1).toString(),
    ...book,
  };
  const updatedBooks = [...allBooks, newBook];
  await writeDb(updatedBooks);
  return newBook;
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  await delay(300);
  let allBooks = await readDb();
  const index = allBooks.findIndex((book) => book.id === updatedBook.id);
  if (index !== -1) {
    allBooks[index] = updatedBook;
    await writeDb(allBooks);
    return allBooks[index];
  }
  return null;
}

export async function deleteBook(id: string): Promise<boolean> {
  await delay(300);
  let allBooks = await readDb();
  const initialLength = allBooks.length;
  const updatedBooks = allBooks.filter((book) => book.id !== id);
  if (updatedBooks.length < initialLength) {
    await writeDb(updatedBooks);
    return true;
  }
  return false;
}
