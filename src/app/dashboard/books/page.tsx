import { getBooks } from '@/lib/data';
import { BookDataTable } from '@/components/books/book-data-table';
import { columns } from '@/components/books/columns';

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Book Management</h1>
        <p className="text-muted-foreground">Add, edit, or delete books from your library.</p>
      </div>
      <BookDataTable columns={columns} data={books} />
    </div>
  );
}
