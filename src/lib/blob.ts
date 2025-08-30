
'use server';

import { head, put, list } from '@vercel/blob';
import type { PutBlobResult } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// This function is specifically for uploading PDF files to Vercel Blob.
export async function uploadPdfToBlob(file: File): Promise<{ success: boolean; path?: string; error?: string }> {
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { success: true, path: blob.url };
}


// A generic function to read any JSON data file from Vercel Blob.
export async function readDataFromBlob<T>(fileName: string): Promise<T[] | null> {
  try {
    const blobCheck = await head(fileName, {
        token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const response = await fetch(blobCheck.url, {
        headers: {
            'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
        },
        next: {
            // Revalidate every 60 seconds to keep data fresh
            revalidate: 60,
        }
    });
    
    if (!response.ok) {
      // If the file exists but we can't fetch it, log the error.
      console.error(`Failed to fetch blob: ${response.statusText} for file ${fileName}`);
      return null;
    }
    
    const data = await response.json();
    return data as T[];

  } catch (error: any) {
    if (error.status === 404) {
      // File doesn't exist, which is a valid case on first run.
      // We'll create it in the action that calls this.
      return null;
    }
    // For other errors, log them.
    console.error(`Error reading blob ${fileName}:`, error.message);
    return null;
  }
}

// A generic function to write any JSON data file to Vercel Blob.
export async function writeDataToBlob<T>(fileName: string, data: T[]): Promise<void> {
  try {
    await put(fileName, JSON.stringify(data, null, 2), {
      access: 'public', // 'public' so it can be fetched by URL, but token is required for overwrite.
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error(`Error writing blob ${fileName}:`, error);
    throw new Error('Failed to write data to blob storage.');
  }
}


// Function to read local data from a file in the /src/lib directory
async function readLocalSeedData<T>(fileName: string): Promise<T[] | null> {
    try {
        const dataDirectory = path.join(process.cwd(), 'src/lib');
        const filePath = path.join(dataDirectory, fileName);
        const jsonData = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(jsonData) as T[];
    } catch (error) {
        console.error(`Could not read local seed file ${fileName}:`, error);
        return null;
    }
}

// This function gets data from the blob. If the blob is empty/doesn't exist,
// it seeds it with local data, then returns the data.
export async function getInitialData<T>(fileName: string): Promise<T[]> {
    let data = await readDataFromBlob<T>(fileName);

    if (data === null) {
        // Blob is empty or doesn't exist, try to seed it from local file
        const localData = await readLocalSeedData<T>(fileName);
        if (localData) {
            console.log(`Seeding blob store for ${fileName} with local data.`);
            await writeDataToBlob(fileName, localData);
            data = localData;
        } else {
            // If local data also fails, return an empty array to prevent crash
            console.warn(`Could not seed ${fileName}. Returning empty array.`);
            data = [];
        }
    }
    return data;
}
