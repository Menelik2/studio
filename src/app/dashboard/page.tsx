
import { getBooks } from '@/lib/data';
import type { Book, Category } from '@/lib/definitions';
import { StatCard } from '@/components/dashboard/stat-card';
import { Book as BookIcon, Feather, Scroll, Theater, BookCopy, Folder, TrendingUp, Calendar, Library, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookFormDialog, useBookDialog } from '@/components/books/book-form-dialog';
import { DeleteBookDialog, useDeleteBookDialog } from '@/components/books/delete-book-dialog';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import Link from 'next/link';

export default async function DashboardPage() {
  const books = await getBooks();

  const totalBooks = books.length;
  
  const uniqueCategories = [...new Set(books.map(book => book.category))];
  const totalCategories = uniqueCategories.length;
  
  const thisYear = new Date().getFullYear();

  const categoryCounts = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);
  
  const recentlyAddedCount = books.filter(book => {
    // This is a placeholder logic. In a real app, you'd store creation dates.
    // For now, let's assume books with IDs > 4 are "recent".
    return parseInt(book.id) > 4;
  }).length;

  const categoryCards = [
    { title: 'Poetry', icon: Feather, count: categoryCounts['Poetry'] || 0 },
    { title: 'Tradition', icon: Scroll, count: categoryCounts['Tradition'] || 0 },
    { title: 'Reading', icon: BookIcon, count: categoryCounts['Reading'] || 0 },
    { title: 'Drama', icon: Theater, count: categoryCounts['Drama'] || 0 },
    { title: 'Folding', icon: Folder, count: categoryCounts['Folding'] || 0 },
  ];

  return (
    <div className="space-y-6">
      <DashboardClient />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your digital library management system</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={Library}
          description="Across all categories"
        />
        <StatCard
          title="Recently Added"
          value={recentlyAddedCount}
          icon={TrendingUp}
          description="This month"
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          icon={BookCopy}
          description="Active categories"
        />
        <StatCard
          title="This Year"
          value={thisYear}
          icon={Calendar}
          description="Current year focus"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
         {categoryCards.map(cat => (
            <Link key={cat.title} href={`/dashboard/books?category=${cat.title}`}>
                <StatCard
                    title={cat.title}
                    value={cat.count}
                    icon={cat.icon}
                    description="books in collection"
                />
            </Link>
         ))}
      </div>
    </div>
  );
}
