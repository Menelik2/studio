
import { getBookById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BookViewerPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);

  if (!book) {
    notFound();
  }

  const isExternal = book.filePath.startsWith('http');

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
      
      {isExternal ? (
        <div className="flex-grow border rounded-lg overflow-hidden">
          <iframe src={book.filePath} className="w-full h-full" title={book.title} />
        </div>
      ) : (
        <Card className="flex-grow flex flex-col items-center justify-center">
            <CardHeader>
                <CardTitle className="text-center">PDF Preview Not Available</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                    This book is stored locally. Please download it to view.
                </p>
                <Button asChild>
                    <a href={book.filePath} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </a>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
