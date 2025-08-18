
'use client';

import { useState } from 'react';
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
import { Planner2FormDialog, usePlanner2Dialog } from './planner-2-form-dialog';

export function Planner2() {
  const [items, setItems] = useState<Planner2Item[]>([]);
  const { onOpen } = usePlanner2Dialog();

  const handleAddItem = () => {
    onOpen(null, (newItem) => {
      setItems([...items, { ...newItem, id: (items.length + 1).toString() }]);
    });
  };

  const handleEditItem = (itemToUpdate: Planner2Item) => {
    onOpen(itemToUpdate, (updatedItem) => {
      setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print:space-y-2">
        <Planner2FormDialog />
        <div className="text-center space-y-2 print:space-y-1">
            <h1 className="font-bold text-lg">የባህር ዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ቤት በበጀት አመቱ የተከናወነ የስራ ተግባራት የሪፖርት ማሳወቂያ ቅጽ</h1>
            <div className="flex justify-around items-center text-sm">
               <p><strong>የክፍሉ ስም:</strong> ________________________</p>
               <p><strong>ዕቅዱ የተፈፀመበት ወር:</strong> ________________________</p>
            </div>
        </div>

        <div className="flex items-center justify-end gap-2 print:hidden">
            <Button onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
            </Button>
        </div>

      <div className="overflow-x-auto rounded-lg border print:border-0 print:shadow-none">
        <Table className="min-w-max whitespace-nowrap">
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
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center print:hidden">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No Items Found</h3>
                    <p className="text-muted-foreground">
                      Get started by adding a new item.
                    </p>
                    <Button onClick={handleAddItem}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Item
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
                items.map((item, index) => (
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
