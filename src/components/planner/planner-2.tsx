
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
import { Edit, FileText, PlusCircle, Printer, Trash2 } from 'lucide-react';
import type { Planner2Item } from '@/lib/definitions';
import { Planner2FormDialog } from './planner-2-form-dialog';
import { getPlanner2ItemsAction, savePlanner2ItemsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { usePlanner2DialogStore } from '@/hooks/use-planner-2-dialog-store';
import { collection, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Planner2() {
  const [items, setItems] = useState<Planner2Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState('');
  const [planMonth, setPlanMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const { onOpen } = usePlanner2DialogStore();
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      try {
        const loadedItems = await getPlanner2ItemsAction();
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
  
  const handleSaveItems = async (updatedItems: Planner2Item[]) => {
    const result = await savePlanner2ItemsAction(updatedItems);
    if(result.success) {
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
      const newId = doc(collection(db, 'planner2')).id;
      const updatedItems = [...items, { ...newItem, id: newId }];
      handleSaveItems(updatedItems);
    });
  };

  const handleEditItem = (itemToUpdate: Planner2Item) => {
    onOpen(itemToUpdate, (updatedItem) => {
      const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      handleSaveItems(updatedItems);
    });
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    handleSaveItems(updatedItems);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Planner 2 - ${year}`;
    window.print();
    document.title = originalTitle;
  };

  const filteredItems = items.filter((item) => item.year === year.toString());

  return (
    <div className="space-y-4 print:space-y-2 print-container planner-2-print-container">
        <Planner2FormDialog />
        <div className="text-center space-y-2 print:space-y-1">
            <h1 className="font-bold text-lg">የባህር ዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ቤት በበጀት አመቱ የተከናወነ የስራ ተግባራት የሪፖርት ማሳወቂያ ቅጽ</h1>
            <div className="grid md:grid-cols-2 gap-4 text-sm print:grid-cols-2">
                <div className="flex items-center gap-2">
                    <strong className="whitespace-nowrap">የክፍሉ ስም:</strong>
                    <Input className="print:border-0 print:pl-2" placeholder="የክፍሉን ስም ያስገቡ" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                    <strong className="whitespace-nowrap">ዕቅዱ የተፈፀመበት ወር:</strong>
                    <Input className="print:border-0 print:pl-2" placeholder="ወር እና ዓመት ያስገቡ" value={planMonth} onChange={(e) => setPlanMonth(e.target.value)} />
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between gap-2 print:hidden">
            <div className="relative">
                <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-28"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleAddItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                </Button>
            </div>
        </div>

      <div className="overflow-x-auto rounded-lg border print-table-container">
        <Table className="min-w-max whitespace-nowrap print-table">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="border-r">ተ.ቁ</TableHead>
              <TableHead className="border-r">የተከናወነው ተግባር ዝርዝር</TableHead>
              <TableHead className="border-r">መለኪያ</TableHead>
              <TableHead className="border-r">የዓመቱ እቅድ</TableHead>
              <TableHead className="border-r">የፀደቀ በጀት</TableHead>
              <TableHead className="border-r">ክንውን</TableHead>
              <TableHead className="border-r">አፈፃፀም በ%</TableHead>
              <TableHead className="print:hidden">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                 <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                        Loading planner data...
                    </TableCell>
                </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center print:hidden">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No Items Found for {year}</h3>
                    <p className="text-muted-foreground">
                      Get started by adding a new item for this year.
                    </p>
                    <Button onClick={handleAddItem}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Item
                    </Button>
                  </div>
                  <div className="hidden print:block text-center p-8">No items for this year.</div>
                </TableCell>
              </TableRow>
            ) : (
                filteredItems.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="border-r">{index + 1}</TableCell>
                        <TableCell className="border-r">{item.activity}</TableCell>
                        <TableCell className="border-r">{item.measure}</TableCell>
                        <TableCell className="border-r">{item.annualPlan}</TableCell>
                        <TableCell className="border-r">{item.approvedBudget}</TableCell>
                        <TableCell className="border-r">{item.performance}</TableCell>
                        <TableCell className="border-r">{item.executionPercentage}</TableCell>
                        <TableCell className="flex gap-2 print:hidden">
                            <Button variant="outline" size="icon" onClick={() => handleEditItem(item)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 print:pt-4">
        <div className="space-y-2">
            <h4 className="font-semibold">ያዘጋጀው የክፍል ተጠሪ: __________________</h4>
            <p>ፊርማ፡ __________________</p>
        </div>
      </div>
    </div>
  );
}
