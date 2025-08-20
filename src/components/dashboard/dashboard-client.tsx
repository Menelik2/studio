
'use client';

import { Button } from '@/components/ui/button';
import { BookFormDialog, useBookDialog } from '@/components/books/book-form-dialog';
import { DeleteBookDialog } from '@/components/books/delete-book-dialog';
import { PlusCircle } from 'lucide-react';


export function DashboardClient() {
    const { onOpen } = useBookDialog();

    return (
        <>
            <div className="fixed top-4 right-4 z-20 print:hidden">
                 <Button onClick={() => onOpen(null, 'create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Book
                </Button>
            </div>
            <BookFormDialog />
            <DeleteBookDialog />
        </>
    )
}
