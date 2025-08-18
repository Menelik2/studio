import { getBooks } from '@/lib/data';
import type { Book, Category } from '@/lib/definitions';
import { StatCard } from '@/components/dashboard/stat-card';
import { Book as BookIcon, Feather, Scroll, Theater } from 'lucide-react';

export default async function DashboardPage() {
  const books = await getBooks();

  const totalBooks = books.length;
  const categoryCounts = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your library.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={BookIcon}
          description="Total number of books in the library."
        />
        <StatCard
          title="Poetry"
          value={categoryCounts['Poetry'] || 0}
          icon={Feather}
          description="Total books in the Poetry category."
        />
        <StatCard
          title="Tradition"
          value={categoryCounts['Tradition'] || 0}
          icon={Scroll}
          description="Total books in the Tradition category."
        />
        <StatCard
          title="Drama"
          value={categoryCounts['Drama'] || 0}
          icon={Theater}
          description="Total books in the Drama category."
        />
      </div>
    </div>
  );
}
