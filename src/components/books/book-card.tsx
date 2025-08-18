'use client';

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
import { Edit, Trash2 } from 'lucide-react';

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
        <CardTitle className="font-headline">{book.title}</CardTitle>
        <CardDescription>
          {book.author} ({book.year})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground">{book.description}</p>
        <Badge variant={variant}>{book.category}</Badge>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-auto">
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
