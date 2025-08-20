
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
import { Edit, Trash2, Eye, MessageSquareQuote, MessageSquarePlus } from 'lucide-react';
import { Separator } from '../ui/separator';
import { motion } from 'framer-motion';

export function BookCard({ book }: { book: Book }) {
  const { onOpen: onOpenDialog } = useBookDialog();
  const { onOpen: onOpenDelete } = useDeleteBookDialog();

  const category = book.category;
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  if (category === 'ግጥም') variant = 'default';
  if (category === 'ድራማ') variant = 'outline';
  if (category === 'መነባንብ') variant = 'destructive';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-xl">
        <CardHeader>
          <Link href={`/dashboard/books/${book.id}`} target="_blank" rel="noopener noreferrer">
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
          <Button asChild variant="secondary" size="icon" title="View">
            <Link href={book.filePath.startsWith('http') ? book.filePath : `/dashboard/books/${book.id}`} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" title="Edit" onClick={() => onOpenDialog(book, 'edit')}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
           <Button variant="outline" size="icon" title="Comment" onClick={() => onOpenDialog(book, 'comment')}>
            <MessageSquarePlus className="h-4 w-4" />
            <span className="sr-only">Comment</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            title="Delete"
            onClick={() => onOpenDelete(book)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
