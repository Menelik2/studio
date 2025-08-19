
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Book } from '@/lib/definitions';
import { BookCard } from '@/components/books/book-card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookFormDialog, useBookDialog } from '@/components/books/book-form-dialog';
import { DeleteBookDialog } from '@/components/books/delete-book-dialog';

export function BookList({ initialBooks }: { initialBooks: Book[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(initialBooks);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const { onOpen } = useBookDialog();

  useEffect(() => {
    // Set the category from URL params only on the client-side
    if (initialCategory) {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    setFilteredBooks(
      initialBooks.filter((book) => {
        const searchTerm = filter.toLowerCase();
        const matchesSearch = (
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.year.toString().includes(filter)
        );
        const matchesCategory = !categoryFilter || book.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
    );
  }, [filter, categoryFilter, initialBooks]);

  return (
    <div className="space-y-6">
      <BookFormDialog />
      <DeleteBookDialog />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Book Management</h1>
            <p className="text-muted-foreground">Add, edit, or delete books from your library.</p>
        </div>
        <div className="flex gap-2">
            <Input
              placeholder="Filter by title, author, or year..."
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => onOpen(null, 'create')}>
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
