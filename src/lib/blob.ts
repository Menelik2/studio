
'use server';

import { head, put } from '@vercel/blob';

// --- Vercel Blob Storage Functions ---

async function readDataFromBlob<T>(fileName: string): Promise<T[] | null> {
    const { BLOB_READ_WRITE_TOKEN } = await import('./env');
    if (!BLOB_READ_WRITE_TOKEN) {
        console.error(`Missing BLOB_READ_WRITE_TOKEN for reading ${fileName}`);
        // On Vercel, this might return an empty array if the var isn't set,
        // but locally it helps to have a clear error.
        return [];
    }

  try {
    const blobCheck = await head(fileName, {
      token: BLOB_READ_WRITE_TOKEN,
    });

    const response = await fetch(blobCheck.url, {
      next: {
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
      console.log(`Blob ${fileName} not found. Returning empty array.`);
      return [];
    }
    console.error(`Error reading blob ${fileName}:`, error);
    // Return empty array on other errors to prevent app crash
    return [];
  }
}

async function writeDataToBlob<T>(fileName: string, data: T[]): Promise<void> {
  const { BLOB_READ_WRITE_TOKEN } = await import('./env');
  if (!BLOB_READ_WRITE_TOKEN) {
      throw new Error(`Missing BLOB_READ_WRITE_TOKEN. Cannot write to ${fileName}.`);
  }

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
    return data || [];
}

/**
 * Writes data to Vercel Blob storage.
 */
export async function writeData<T>(fileName:string, data: T[]): Promise<void> {
    await writeDataToBlob(fileName, data);
}
