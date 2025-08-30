
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Book } from '@/lib/definitions';
import { useBookDialogStore } from '@/hooks/use-book-dialog-store';
import { useDeleteBookDialogStore } from '@/hooks/use-delete-book-dialog-store';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'author',
    header: 'Author',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
        const category = row.getValue('category') as string;
        let variant: 'default' | 'secondary' | 'outline' = 'secondary';
        if (category === 'Poetry') variant = 'default';
        if (category === 'Drama') variant = 'outline';
        
        return <Badge variant={variant}>{category}</Badge>
    }
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    id: 'actions',
    cell: function Cell({ row }) {
      const book = row.original;
      const { onOpen: onOpenEdit } = useBookDialogStore();
      const { onOpen: onOpenDelete } = useDeleteBookDialogStore();

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(book.id)}>
                Copy Book ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onOpenEdit(book, 'edit')}>Edit Book</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => onOpenDelete(book)}
              >
                Delete Book
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
