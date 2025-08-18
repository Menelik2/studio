'use client';

import { useEffect, useState } from 'react';
import { getBooks } from '@/lib/data';
import type { Book } from '@/lib/definitions';
import { BookCard } from '@/components/books/book-card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookFormDialog, useBookDialog } from '@/components/books/book-form-dialog';
import { DeleteBookDialog, useDeleteBookDialog } from '@/components/books/delete-book-dialog';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState('');
  const { onOpen } = useBookDialog();
  const { bookToDelete } = useDeleteBookDialog();
  
  // This is a workaround to fetch data on the client, since the page is now a client component
  // In a real app, you would use a library like SWR or React Query
  useEffect(() => {
    async function fetchData() {
      const allBooks = await getBooks();
      setBooks(allBooks);
      setFilteredBooks(allBooks);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        book.title.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, books]);

  return (
    <div className="space-y-6">
      <BookFormDialog />
      <DeleteBookDialog book={bookToDelete} />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Book Management</h1>
            <p className="text-muted-foreground">Add, edit, or delete books from your library.</p>
        </div>
        <div className="flex gap-2">
            <Input
              placeholder="Filter by title..."
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => onOpen(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Book
            </Button>
        </div>
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No books found.</p>
        </div>
      )}
    </div>
  );
}
