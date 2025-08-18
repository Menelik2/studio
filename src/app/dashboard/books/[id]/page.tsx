import { getBookById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BookViewerPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">{book.title}</h1>
          <p className="text-muted-foreground">{book.author} ({book.year})</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </header>
      <div className="flex-grow border rounded-lg overflow-hidden">
        <iframe src={book.filePath} className="w-full h-full" title={book.title} />
      </div>
    </div>
  );
}
