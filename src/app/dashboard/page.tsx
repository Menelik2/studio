
import { getBooksAction } from '@/lib/actions';
import type { Book, Category } from '@/lib/definitions';
import { StatCard } from '@/components/dashboard/stat-card';
import { Book as BookIcon, Feather, Scroll, Theater, BookCopy, Folder, TrendingUp, Calendar, Library, BookText } from 'lucide-react';
import Link from 'next/link';
import { BookFormDialog } from '@/components/books/book-form-dialog';
import { DeleteBookDialog } from '@/components/books/delete-book-dialog';

export default async function DashboardPage() {
  const books = await getBooksAction();

  const totalBooks = books.length;
  
  const uniqueCategories = [...new Set(books.map(book => book.category))];
  const totalCategories = uniqueCategories.length;
  
  const thisYear = new Date().getFullYear();

  const categoryCounts = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);
  
  const categoryCards = [
    { title: 'ግጥም', icon: Feather, count: categoryCounts['ግጥም'] || 0 },
    { title: 'ወግ', icon: Scroll, count: categoryCounts['ወግ'] || 0 },
    { title: 'መነባንብ', icon: BookIcon, count: categoryCounts['መነባንብ'] || 0 },
    { title: 'ድራማ', icon: Theater, count: categoryCounts['ድራማ'] || 0 },
    { title: 'መጣጥፍ', icon: Folder, count: categoryCounts['መጣጥፍ'] || 0 },
    { title: 'ሌሎች መፅሐፍት', icon: BookText, count: categoryCounts['ሌሎች መፅሐፍት'] || 0 },
  ];

  return (
    <div className="space-y-6">
      <BookFormDialog />
      <DeleteBookDialog />
      <div className="w-full text-center">
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">ባህር ዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ቤት</h1>
        <p className="text-muted-foreground animate-fade-in-up [text-shadow:1px_1px_2px_rgba(0,0,0,0.1)]">Welcome to your Dashboard</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="ጠቅላላ መጽሐፍት"
          value={totalBooks}
          icon={Library}
          description="Across all categories"
        />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={BookCopy}
          description="Active categories"
        />
        <StatCard
          title="Current Year"
          value={thisYear}
          icon={Calendar}
          description="Current year focus"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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
