
import { getBookById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BookViewerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const book = await getBookById(id);

  if (!book || !book.filePath) {
    notFound();
  }
  
  // The filePath should now always be a full, valid URL.
  const isUrl = book.filePath.startsWith('http');

  if (!isUrl) {
    // If we somehow have a path that isn't a URL, we can't display it.
    console.error(`Invalid file path for book ${id}: ${book.filePath}`);
    notFound();
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
        <iframe src={book.filePath} className="w-full h-full" title={book.title} />
      </div>
    </div>
  );
}
