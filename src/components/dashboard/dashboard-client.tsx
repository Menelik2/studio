
'use client';

import { BookFormDialog } from '@/components/books/book-form-dialog';
import { DeleteBookDialog } from '@/components/books/delete-book-dialog';

export function DashboardClient() {
    return (
        <>
            <BookFormDialog />
            <DeleteBookDialog />
        </>
    )
}
