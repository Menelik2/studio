
import { Suspense } from 'react';
import { getBooksAction } from '@/lib/actions';
import { BookList } from '@/components/books/book-list';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

function BooksPageSkeleton() {
  return (
    <div className="space-y-6">
       <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Book Management</h1>
            <p className="text-muted-foreground">Add, edit, or delete books from your library.</p>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default async function BooksPage() {
  const books = await getBooksAction();

  return (
    <Suspense fallback={<BooksPageSkeleton />}>
      <BookList initialBooks={books} />
    </Suspense>
  );
}
