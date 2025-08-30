
'use server';

import { head, put, list } from '@vercel/blob';

// --- Vercel Blob Storage Functions ---

async function readDataFromBlob<T>(fileName: string): Promise<T[] | null> {
  try {
    const blobCheck = await head(fileName, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const response = await fetch(blobCheck.url, {
      headers: {
        'x-vercel-protection-bypass': process.env.VERCEL_PROTECTION_BYPASS_SECRET!,
      },
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
    if (error.status === 404) {
      // File doesn't exist, which is a valid case on first run.
      console.log(`Blob ${fileName} not found. Returning empty array.`);
      return [];
    }
    console.error(`Error reading blob ${fileName}:`, error.message);
    return null;
  }
}

async function writeDataToBlob<T>(fileName: string, data: T[]): Promise<void> {
  try {
    await put(fileName, JSON.stringify(data, null, 2), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error(`Error writing blob ${fileName}:`, error);
    throw new Error('Failed to write data to blob storage.');
  }
}


// --- Unified Data Functions ---

/**
 * Reads data from Vercel Blob storage.
 * In local dev, it will fail gracefully and return an empty array if the blob doesn't exist.
 * The local JSON files are now only for reference or manual seeding.
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
