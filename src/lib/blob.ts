
'use server';

import { head, put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// This determines if we are in a Vercel deployment environment.
const isVercelDeployment = !!process.env.VERCEL_URL;

// --- Vercel Blob Storage Functions ---

async function readDataFromBlob<T>(fileName: string): Promise<T[] | null> {
  try {
    const blobCheck = await head(fileName, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const response = await fetch(blobCheck.url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
      next: {
        // Revalidate frequently to keep data fresh, but not on every request.
        revalidate: 60,
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
      return null;
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

export async function uploadPdfToBlob(file: File): Promise<{ success: boolean; path?: string; error?: string }> {
  const blob = await put(file.name, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { success: true, path: blob.url };
}

// --- Local File System Functions ---

async function readLocalData<T>(fileName: string): Promise<T[]> {
  try {
    const dataDirectory = path.join(process.cwd(), 'src/lib');
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData) as T[];
  } catch (error) {
    // If the file doesn't exist, return empty array.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error(`Could not read local file ${fileName}:`, error);
    return [];
  }
}

async function writeLocalData<T>(fileName: string, data: T[]): Promise<void> {
  const dataDirectory = path.join(process.cwd(), 'src/lib');
  const filePath = path.join(dataDirectory, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


// --- Unified Data Functions ---

/**
 * Reads data from the appropriate source.
 * If deployed on Vercel, it uses Vercel Blob.
 * If the blob is empty/new, it seeds it from the local JSON file.
 * If running locally, it uses the local JSON files directly.
 */
export async function readData<T>(fileName: string): Promise<T[]> {
  if (isVercelDeployment) {
    let data = await readDataFromBlob<T>(fileName);
    if (data === null) {
      // Blob is empty or doesn't exist, seed it from local file.
      const localData = await readLocalData<T>(fileName);
      if (localData && localData.length > 0) {
        console.log(`Seeding blob store for ${fileName} with local data.`);
        await writeDataToBlob(fileName, localData);
        data = localData;
      } else {
        // If no local data, start with an empty array.
        data = [];
      }
    }
    return data;
  } else {
    // In local development, always read from the local file.
    return readLocalData<T>(fileName);
  }
}

/**
 * Writes data to the appropriate source.
 * If deployed on Vercel, writes to Vercel Blob.
 * If running locally, writes to the local JSON file.
 */
export async function writeData<T>(fileName: string, data: T[]): Promise<void> {
  if (isVercelDeployment) {
    await writeDataToBlob(fileName, data);
  } else {
    await writeLocalData(fileName, data);
  }
}
