
import { getBookById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { head } from '@vercel/blob';

async function getBlobUrl(pathname: string): Promise<string | null> {
    try {
      // Remove leading '/' from pathname to match blob store
      const blobPath = pathname.substring(1);
      const blobInfo = await head(blobPath, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return blobInfo.url;
    } catch (error: any) {
        if (error.status === 404) {
            console.warn(`PDF not found in blob storage: ${pathname}`);
            return null;
        }
        console.error(`Error fetching blob URL for ${pathname}:`, error);
        return null;
    }
}

export default async function BookViewerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }
  
  // Filepath can be a direct external URL or a path to a blob
  const isExternalUrl = book.filePath.startsWith('http');
  // For Vercel deployment, the file path is now just the pathname, so we need the full blob URL
  const blobUrl = process.env.VERCEL_ENV && !isExternalUrl
    ? await getBlobUrl(book.filePath) 
    : isExternalUrl 
      ? book.filePath
      // This case is for local dev where filepath might be a blob url
      : book.filePath.includes('blob.vercel-storage.com') 
        ? book.filePath
        : notFound();


  if (!blobUrl) {
    // If we can't find the file, redirect to a 404 or back to the library
    return notFound();
  }

  // Display the content in an iframe
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-background z-10">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight">{book.title}</h1>
          <p className="text-muted-foreground">{book.author} ({book.year})</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </header>
      
      <div className="flex-grow border rounded-lg overflow-hidden m-4 mt-0">
        <iframe src={blobUrl} className="w-full h-full" title={book.title} />
      </div>
    </div>
  );
}
