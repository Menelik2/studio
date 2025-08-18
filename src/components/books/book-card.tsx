
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/lib/definitions';
import { useBookDialog } from './book-form-dialog';
import { useDeleteBookDialog } from './delete-book-dialog';
import { Edit, Trash2, Eye, MessageSquareQuote } from 'lucide-react';
import { Separator } from '../ui/separator';

export function BookCard({ book }: { book: Book }) {
  const { onOpen: onOpenEdit } = useBookDialog();
  const { onOpen: onOpenDelete } = useDeleteBookDialog();

  const category = book.category;
  let variant: 'default' | 'secondary' | 'outline' = 'secondary';
  if (category === 'Poetry') variant = 'default';
  if (category === 'Drama') variant = 'outline';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Link href={`/dashboard/books/${book.id}`}>
          <CardTitle className="font-headline hover:underline">{book.title}</CardTitle>
        </Link>
        <CardDescription>
          {book.author} ({book.year})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
        <Badge variant={variant}>{book.category}</Badge>
        {book.comment && (
            <div className="space-y-2 pt-2">
                <Separator />
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MessageSquareQuote className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="italic line-clamp-2">"{book.comment}"</p>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild variant="secondary" size="icon">
          <Link href={`/dashboard/books/${book.id}`}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Link>
        </Button>
        <Button variant="outline" size="icon" onClick={() => onOpenEdit(book)}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onOpenDelete(book)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
