import { getBooks } from '@/lib/data';
import { BookList } from '@/components/books/book-list';

export default async function BooksPage() {
  const books = await getBooks();

  return <BookList initialBooks={books} />;
}
