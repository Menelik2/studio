
'use server';

import type { Book, PlannerItem, Planner2Item, PlannerSignatures } from './definitions';

// This file is being kept for type definitions but its file system
// functions are being removed to ensure compatibility with Vercel's
// serverless environment. All data operations will now be handled
// directly with Vercel Blob storage via functions in actions.ts and blob.ts.

// The local .json files in this directory now serve as a "seed" for the
// Vercel Blob storage on the first deployment.

export async function getBookById(id: string): Promise<Book | undefined> {
  const { getInitialData } = await import('./blob');
  const books = await getInitialData<Book>('books.json');
  return books.find((book) => book.id === id);
}
