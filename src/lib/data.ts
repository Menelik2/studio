import type { Book } from './definitions';

// In-memory store to simulate a database
let books: Book[] = [
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

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getBooks(): Promise<Book[]> {
  await delay(500);
  return books;
}

export async function getBookById(id: string): Promise<Book | undefined> {
  await delay(200);
  return books.find((book) => book.id === id);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  await delay(300);
  const newBook: Book = {
    id: (Math.max(...books.map(b => parseInt(b.id, 10))) + 1).toString(),
    ...book,
  };
  books.push(newBook);
  return newBook;
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  await delay(300);
  const index = books.findIndex((book) => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    return books[index];
  }
  return null;
}

export async function deleteBook(id: string): Promise<boolean> {
  await delay(300);
  const initialLength = books.length;
  books = books.filter((book) => book.id !== id);
  return books.length < initialLength;
}
