
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { MoreHorizontal, Edit, FileText, PlusCircle, Search, Trash2, Printer } from 'lucide-react';
import type { PlannerItem } from '@/lib/definitions';
import { PlannerFormDialog, usePlannerDialog } from './planner-form-dialog';
import { getPlanner1ItemsAction, savePlanner1ItemsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quarters = {
  '1ኛ ሩብ ዓመት': ['ሐምሌ', 'ነሐሴ', 'መስከረም'],
  '2ኛ ሩብ ዓመት': ['ጥቅምት', 'ህዳር', 'ታህሳስ'],
  '3ኛ ሩብ ዓመት': ['ጥር', 'የካቲት', 'መጋቢት'],
  '4ኛ ሩብ ዓመት': ['ሚያዝያ', 'ግንቦት', 'ሰኔ'],
};

export function Planner() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { onOpen } = usePlannerDialog();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      try {
        const loadedItems = await getPlanner1ItemsAction();
        setItems(loadedItems);
      } catch (error) {
        toast({
            title: 'Error loading planner data',
            description: 'Could not fetch planner items from the server.',
            variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, [toast]);

  const handleSaveItems = async (updatedItems: PlannerItem[]) => {
    const result = await savePlanner1ItemsAction(updatedItems);
    if (result.success) {
      setItems(updatedItems);
      toast({
        title: 'Planner Saved',
        description: 'Your changes have been saved successfully.',
      });
    } else {
      toast({
        title: 'Error Saving Planner',
        description: 'Could not save your changes to the server.',
        variant: 'destructive',
      });
    }
  };


  const handleAddItem = () => {
    onOpen(null, (newItem) => {
        const updatedItems = [...items, {...newItem, id: (items.length + 1).toString()}];
        handleSaveItems(updatedItems);
    });
  };
  
  const handleEditItem = (itemToUpdate: PlannerItem) => {
    onOpen(itemToUpdate, (updatedItem) => {
        const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        handleSaveItems(updatedItems);
    });
  }

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    handleSaveItems(updatedItems);
  }
  
  const handlePrint = () => {
    window.print();
  };

  const filteredItems = items
    .filter(item => item.year === year.toString())
    .filter(item => item.task.toLowerCase().includes(searchTerm.toLowerCase()));

  const formatMonths = (months: Record<string, boolean>) => {
    const selectedMonths = Object.entries(months)
        .filter(([,isSelected]) => isSelected)
        .map(([month]) => month);
    if (selectedMonths.length === 0) return 'ምንም አልተመረጠም';
    if (selectedMonths.length > 3) return `${selectedMonths.slice(0, 3).join(', ')}...`;
    return selectedMonths.join(', ');
  }

  return (
    <div className="space-y-4 print:space-y-2 print-container">
      <PlannerFormDialog />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">የስራ እቅድ ማሰናጃ</h1>
            <p className="text-muted-foreground">አዳዲስ እቅዶችን ያክሉ፣ ያርትዑ፣ ወይም ይሰርዙ።</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="በተግባር ፈልግ..." 
                    className="pl-8 w-40" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-28"
            />
            <Button onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              አዲስ ዝግጅት ጨምር
            </Button>
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
            </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border print-table-container">
        <Table className="min-w-full whitespace-nowrap print-table">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="border-r">ተ.ቁ</TableHead>
              <TableHead className="border-r">ዝርዝር ተግባር</TableHead>
              <TableHead className="border-r">መለኪያ</TableHead>
              <TableHead className="border-r">ብዛት</TableHead>
              <TableHead className="border-r">ከማን ጋር እንሰራለን?</TableHead>
              <TableHead className="border-r">የተመረጡ ወራት</TableHead>
              <TableHead className="border-r">የተጠየቀው በጀት</TableHead>
              <TableHead className="border-r">የጸደቀ ወጪ</TableHead>
              <TableHead className="border-r">የጸደቀ ገቢ</TableHead>
              <TableHead className="print:hidden text-right">ድርጊቶች</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                        የእቅድ መረጃ በመጫን ላይ...
                    </TableCell>
                </TableRow>
             ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center print:hidden">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">ለ {year} ምንም እቅድ አልተገኘም</h3>
                    <p className="text-muted-foreground">
                      ለዚህ አመት አዲስ እቅድ በመጨመር ይጀምሩ።
                    </p>
                    <Button onClick={handleAddItem}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      የመጀመሪያ እቅድዎን ያክሉ
                    </Button>
                  </div>
                   <div className="hidden print:block text-center p-8">No items for this year.</div>
                </TableCell>
              </TableRow>
            ) : (
                filteredItems.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="border-r">{index + 1}</TableCell>
                        <TableCell className="border-r font-medium">{item.task}</TableCell>
                        <TableCell className="border-r">{item.measure}</TableCell>
                        <TableCell className="border-r">{item.quantity}</TableCell>
                        <TableCell className="border-r">{item.collaborator}</TableCell>
                        <TableCell className="border-r text-muted-foreground text-xs">{formatMonths(item.months)}</TableCell>
                        <TableCell className="border-r">{item.budgetRequested}</TableCell>
                        <TableCell className="border-r">{item.approvedCost}</TableCell>
                        <TableCell className="border-r">{item.approvedIncome}</TableCell>
                        <TableCell className="text-right print:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>አርትዕ</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-500 focus:text-red-500"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>ሰርዝ</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 print:hidden">
        <div className="space-y-2">
            <h4 className="font-semibold">የዝግጅት ኃላፊ ፈርማ፡-</h4>
            <Input placeholder="ስም ያስገቡ" />
            <p>ስም፡</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold">የእይታ ኃላፊ ፈርማ፡-</h4>
            <Input placeholder="ስም ያስገቡ" />
            <p>ስም፡</p>
        </div>
      </div>
    </div>
  );
}
