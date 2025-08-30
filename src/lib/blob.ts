
'use server';

import { head, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from './env';

// --- Vercel Blob Storage Functions ---

async function readDataFromBlob<T>(fileName: string): Promise<T[] | null> {
  try {
    const blobCheck = await head(fileName, {
      token: BLOB_READ_WRITE_TOKEN,
    });

    const response = await fetch(blobCheck.url, {
      next: {
        // Revalidate frequently to keep data fresh, but not on every request.
        revalidate: 1,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch blob: ${response.statusText} for file ${fileName}`);
      return null;
    }

    const data = await response.json();
    return data as T[];
  } catch (error: any) {
    if (error.status === 404 || (error.message && error.message.includes('404'))) {
      // File doesn't exist, which is a valid case on first run.
      console.log(`Blob ${fileName} not found. Returning empty array.`);
      return [];
    }
    console.error(`Error reading blob ${fileName}:`, error.message);
    throw error;
  }
}

async function writeDataToBlob<T>(fileName: string, data: T[]): Promise<void> {
  try {
    await put(fileName, JSON.stringify(data, null, 2), {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error(`Error writing blob ${fileName}:`, error);
    throw new Error('Failed to write data to blob storage.');
  }
}


// --- Unified Data Functions ---

/**
 * Reads data from Vercel Blob storage.
 */
export async function readData<T>(fileName: string): Promise<T[]> {
    const data = await readDataFromBlob<T>(fileName);
    // If blob returns null (due to an error) or is empty, return an empty array.
    return data || [];
}

/**
 * Writes data to Vercel Blob storage.
 */
export async function writeData<T>(fileName:string, data: T[]): Promise<void> {
    await writeDataToBlob(fileName, data);
}
