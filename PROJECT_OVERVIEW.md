# Local Library Lore - Project Overview

This document provides a technical overview of the "Local Library Lore" application, detailing its features and showcasing relevant code snippets from the implementation.

The application is built with Next.js (App Router), React, and Tailwind CSS, using ShadCN for UI components. 

## Backend & Data Persistence (Node.js)

The backend is built on Node.js, which is the runtime for all Next.js server-side features. Instead of a traditional database, this application uses a file-based persistence system.

**`src/lib/*.json`**:
- `books.json`, `planner1.json`, and `planner2.json` act as the "database". They are simple JSON files that store the application's data persistently on the server.

**`src/lib/data.ts`**:
- This file is the data access layer. It uses the Node.js `fs` (file system) module to read from and write to the JSON files. It abstracts the file operations into asynchronous functions like `getBooks`, `addBook`, etc. This file is marked with `'use server';` to ensure it only ever runs on the server.

**`src/lib/actions.ts`**:
- This file serves as the API layer. It contains Next.js Server Actions, which are server-side functions that can be called directly from client-side components. These actions handle business logic (like validation with Zod) and then use the functions from `data.ts` to interact with the JSON "database".

This setup provides a robust, self-contained backend without requiring an external database service.

## 1. Authentication

A simple, mock login page serves as the entry point for accessing the admin dashboard.

**`src/app/login/page.tsx`**: The login page UI.
```tsx
import { LoginForm } from '@/components/auth/login-form';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      {/* ... */}
      <LoginForm />
    </main>
  );
}
```

**`src/lib/actions.ts`**: The server action that handles the login. It currently just redirects to the dashboard.
```ts
// @ts-nocheck
'use server';
// ...
import { redirect } from 'next/navigation';

// Mock login action
export async function loginAction() {
  redirect('/dashboard');
}
// ...
```

## 2. Dashboard

The dashboard provides a statistical overview of the library.

**`src/app/dashboard/page.tsx`**: This page fetches book data and calculates stats. The category cards are interactive, linking to a filtered book view.

```tsx
import { getBooks } from '@/lib/data';
import type { Book, Category } from '@/lib/definitions';
import { StatCard } from '@/components/dashboard/stat-card';
import { Book as BookIcon, Feather, Scroll, Theater, BookCopy, Folder, TrendingUp, Calendar, Library } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const books = await getBooks();
  // ... (statistics calculation logic)

  const categoryCards = [
    { title: 'Poetry', icon: Feather, count: categoryCounts['Poetry'] || 0 },
    { title: 'Tradition', icon: Scroll, count: categoryCounts['Tradition'] || 0 },
    { title: 'Reading', icon: BookIcon, count: categoryCounts['Reading'] || 0 },
    { title: 'Drama', icon: Theater, count: categoryCounts['Drama'] || 0 },
    { title: 'Folding', icon: Folder, count: categoryCounts['Folding'] || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* ... StatCards for Total Books, etc. */}

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
```

## 3. Book Management (CRUD)

This is the core feature, allowing full management of the book library.

### UI Components

**`src/components/books/book-list.tsx`**: Displays the books and handles filtering by search term or category.

```tsx
'use client';
// ...
export function BookList({ initialBooks }: { initialBooks: Book[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  // ... (state for filtering)

  useEffect(() => {
    // ... (filtering logic)
  }, [filter, categoryFilter, initialBooks]);

  return (
    <div className="space-y-6">
      {/* ... (Dialogs and Header UI) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
```

**`src/components/books/book-card.tsx`**: Renders a single book with action buttons.

```tsx
'use client';
// ...
export function BookCard({ book }: { book: Book }) {
  const { onOpen: onOpenDialog } = useBookDialog();
  const { onOpen: onOpenDelete } = useDeleteBookDialog();

  return (
    <Card className="flex flex-col h-full">
      {/* ... */}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild variant="secondary" size="icon" title="View">
          <Link href={`/dashboard/books/${book.id}`} target="_blank" rel="noopener noreferrer">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" title="Edit" onClick={() => onOpenDialog(book, 'edit')}>
          <Edit className="h-4 w-4" />
        </Button>
         <Button variant="outline" size="icon" title="Comment" onClick={() => onOpenDialog(book, 'comment')}>
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" title="Delete" onClick={() => onOpenDelete(book)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

**`src/components/books/book-form-dialog.tsx`**: A shared state dialog for creating, editing, and commenting on books.

```tsx
'use client';
// ...
export function BookFormDialog() {
  const { isOpen, book, mode, onClose } = useBookDialog();
  const isEdit = !!book;
  
  // Uses a different server action based on whether it's a create or update operation
  const action = isEdit ? updateBookAction : createBookAction;
  const [formState, formAction] = useActionState(action, { /*...*/ });
  // ...
}
```

### Backend Logic (`actions.ts`)

Server Actions handle form submissions for creating, updating, and deleting books. It uses Zod for validation.

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addBook, deleteBook, updateBook } from './data';
// ...

const bookSchema = z.object({ /* ... */ });

// Action for creating a new book
export async function createBookAction(prevState: FormState, formData: FormData) {
  const book = Object.fromEntries(formData.entries());
  return handleBookAction(book as unknown as Book, 'create');
}

// Action for updating an existing book
export async function updateBookAction(prevState: FormState, formData: FormData) {
  const book = Object.fromEntries(formData.entries());
  return handleBookAction(book as unknown as Book, 'update');
}

// Action for deleting a book
export async function deleteBookAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await deleteBook(id);
    revalidatePath('/dashboard/books'); // Revalidates cache
    revalidatePath('/dashboard');
    return { message: 'Book deleted successfully.' };
  } catch (error) {
    return { message: 'Database Error: Failed to delete book.' };
  }
}
```

## 4. Planners

The application features two distinct planners, each with its own data structure and UI. Both support adding, editing, deleting, and printing. Data for both planners is persisted on the server using a similar mechanism to the book management system, utilizing `planner1.json` and `planner2.json` files and corresponding data functions and server actions for permanent storage.

### Planner 1

**`src/components/planner/planner.tsx`**: Manages state for planner items and renders the complex table. It uses server actions (`getPlanner1ItemsAction`, `savePlanner1ItemsAction`) to fetch and persist data.

```tsx
'use client';
// ...
export function Planner() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [items, setItems] = useState<PlannerItem[]>([]);
  const { onOpen } = usePlannerDialog();

  useEffect(() => {
    async function loadItems() {
      const loadedItems = await getPlanner1ItemsAction();
      setItems(loadedItems);
    }
    loadItems();
  }, []);

  const handleSaveItems = async (updatedItems: PlannerItem[]) => {
    await savePlanner1ItemsAction(updatedItems);
    setItems(updatedItems);
    // ...
  };

  const handleAddItem = () => { /* ... */ };
  const handleEditItem = (itemToUpdate: PlannerItem) => { /* ... */ };
  const handleRemoveItem = (id: string) => { /* ... */ };
  const handlePrint = () => { window.print(); };

  const filteredItems = items.filter(item => item.year === year.toString());

  return (
    <div className="space-y-4 print:space-y-0">
      <PlannerFormDialog />
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        {/* ... (Filters and Buttons) */}
      </div>
      <div className="overflow-x-auto rounded-lg border print:border-0 print:shadow-none">
        <Table>
            {/* ... (Complex header structure) */}
        </Table>
      </div>
    </div>
  );
}
```

### Planner 2

**`src/components/planner/planner-2.tsx`**: Similar to Planner 1 but with a different table structure and editable header fields. It also uses server actions for data persistence.

```tsx
'use client';
// ...
export function Planner2() {
  const [items, setItems] = useState<Planner2Item[]>([]);
  const [departmentName, setDepartmentName] = useState('');
  const [planMonth, setPlanMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  // ...
  
  useEffect(() => {
    async function loadItems() {
      const loadedItems = await getPlanner2ItemsAction();
      setItems(loadedItems);
    }
    loadItems();
  }, []);
  
  const handleSaveItems = async (updatedItems: Planner2Item[]) => {
     await savePlanner2ItemsAction(updatedItems);
     setItems(updatedItems);
     //...
  }

  return (
    <div className="space-y-4 print:space-y-2">
      <Planner2FormDialog />
      <div className="text-center space-y-2 print:space-y-1">
        {/* ... */}
        <div className="flex items-center gap-2">
            <strong className="whitespace-nowrap">የክፍሉ ስም:</strong>
            <Input className="print:border-0 print:pl-2" placeholder="የክፍሉን ስም ያስገቡ" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
        </div>
        {/* ... */}
      </div>
      {/* ... (Table and Actions) */}
    </div>
  );
}
```
