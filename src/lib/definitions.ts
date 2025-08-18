export type Category = 'Poetry' | 'Tradition' | 'Drama';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  description: string;
  filePath: string;
}
