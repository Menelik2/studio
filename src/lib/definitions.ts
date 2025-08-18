
export type Category = 'Poetry' | 'Tradition' | 'Drama';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  description: string;
  filePath: string;
  comment?: string;
}

export interface PlannerItem {
    id: string;
    task: string;
    measure: string;
    quantity: string;
    collaborator: string;
    budgetRequested: string;
    approvedCost: string;
    approvedIncome: string;
    year: string;
    months: Record<string, boolean>;
}
