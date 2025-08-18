# Local Library Lore - Project Overview

This document provides a technical overview of the "Local Library Lore" application, detailing its features and showcasing relevant code snippets from the implementation.

The application is built with Next.js (App Router), React, and Tailwind CSS, using ShadCN for UI components. 

## Backend & Data Persistence (Node.js)

The backend is built on Node.js, which is the runtime for all Next.js server-side features. Instead of a traditional database, this application uses a file-based persistence system.

**`src/lib/*.json`**:
- `books.json`, `planner1.json`, and `planner2.json` act as the "database". They are simple JSON files that store the application's data persistently on the server.

**`src/lib/data.ts`**:
- This file is the data access layer. It uses the Node.js `fs` (file system) module to read from and write to the JSON files. It abstracts the file operations into asynchronous functions like `getBooks`, `addBook`, etc.

**`src/lib/actions.ts`**:
- This file serves as the API layer. It contains Next.js Server Actions, which are server-side functions that can be called directly from client-side components. These actions handle business logic (like validation with Zod) and then use the functions from `data.ts` to interact with the JSON "database".

This setup provides a robust, self-contained backend without requiring an external database service.

## Frontend Architecture (React & Next.js)

The frontend is built using a modern component-based architecture that leverages the power of React and Next.js.

**`src/app/**` (App Router)**:
- The file-based routing system is used to define pages and layouts. Server Components are used by default to fetch data and render static content, which improves performance.

**`src/components/**` (React Components)**:
- The UI is broken down into reusable components. Components that require interactivity, state, or browser-only APIs are marked with `'use client';`.
- **State Management**: Client components use React hooks (`useState`, `useEffect`) to manage local state. For cross-component state (like opening/closing dialogs), a simple global store pattern is implemented.
- **Styling**: ShadCN UI provides pre-built components (like `Button`, `Card`, `Dialog`) which are styled using Tailwind CSS for a consistent and modern design.

**Connecting Frontend to Backend**:
- The frontend communicates with the backend exclusively through **Next.js Server Actions** defined in `src/lib/actions.ts`. Client components, like forms, directly invoke these server actions, which handle data validation, persistence, and cache revalidation. This provides a seamless and secure way to manage data without writing traditional API endpoints.

---

## Feature Breakdown

### 1. Authentication

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

### 2. Dashboard

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

### 3. Book Management (CRUD)

This is the core feature, allowing full management of the book library.

#### UI Components

**`src/components/books/book-list.tsx`**: A client component (`'use client'`) that displays the books and handles filtering by search term or category.

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

**`src/components/books/book-form-dialog.tsx`**: A shared state dialog for creating, editing, and commenting on books. It directly invokes server actions for form submission.

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

#### Backend Logic (`actions.ts`)

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

### 4. Planners

The application features two distinct planners, each with its own data structure and UI. Both support adding, editing, deleting, and printing. Data for both planners is persisted on the server using the same mechanism as the book management system.

#### Planner 1

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
  // ...
}
```

#### Planner 2

**`src/components/planner/planner-2.tsx`**: Similar to Planner 1 but with a different table structure. It also uses server actions for data persistence.

```tsx
'use client';
// ...
export function Planner2() {
  const [items, setItems] = useState<Planner2Item[]>([]);
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

  // ...
}
```