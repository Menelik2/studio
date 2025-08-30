
'use server';

// This file is dynamically loaded, so we don't need to import 'dotenv/config'
// Vercel handles environment variables automatically.

export const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// No need to throw an error here, as functions calling it will handle the check.
// This prevents build-time errors on Vercel where env vars might not be available
// during the build step but are at runtime.
