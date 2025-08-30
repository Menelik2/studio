'use server';

import 'dotenv/config';

export const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    'Missing BLOB_READ_WRITE_TOKEN environment variable. Please set it in your .env.local file or in your Vercel project settings.'
  );
}
