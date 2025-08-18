
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Edit, FileText, PlusCircle, Search, Trash2, Printer } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import type { PlannerItem } from '@/lib/definitions';
import { PlannerFormDialog, usePlannerDialog } from './planner-form-dialog';
import { getPlanner1Items, savePlanner1Items } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const quarters = {
  '1st quarter': ['July', 'August', 'September'],
  '2nd quarter': ['October', 'November', 'December'],
  '3rd quarter': ['January', 'February', 'March'],
  '4th quarter': ['April', 'May', 'June'],
};

export function Planner() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { onOpen } = usePlannerDialog();
  const { toast } = useToast();

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      try {
        const loadedItems = await getPlanner1Items();
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
    try {
      await savePlanner1Items(updatedItems);
      setItems(updatedItems);
      toast({
        title: 'Planner Saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
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

  const filteredItems = items.filter(item => item.year === year.toString());

  return (
    <div className="space-y-4 print:space-y-0">
      <PlannerFormDialog />
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ፈልግ..." className="pl-8 w-40" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ሁሉንም</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-28"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="overflow-x-auto rounded-lg border print:border-0 print:shadow-none">
        <Table className="min-w-max whitespace-nowrap">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead rowSpan={2} className="border-r">No</TableHead>
              <TableHead rowSpan={2} className="border-r">detailed task</TableHead>
              <TableHead rowSpan={2} className="border-r">Measure</TableHead>
              <TableHead rowSpan={2} className="border-r">Quantity</TableHead>
              <TableHead rowSpan={2} className="border-r">Who will we work with?</TableHead>
              {Object.keys(quarters).map((quarter) => (
                <TableHead key={quarter} colSpan={3} className="text-center border-r">
                  {quarter}
                </TableHead>
              ))}
              <TableHead rowSpan={2} className="border-r">The budget requested by the department</TableHead>
              <TableHead colSpan={2} className="text-center border-r">Approved budget</TableHead>
              <TableHead rowSpan={2} className="print:hidden">Actions</TableHead>
            </TableRow>
            <TableRow className="bg-muted hover:bg-muted">
              {Object.values(quarters)
                .flat()
                .map((month) => (
                  <TableHead key={month} className="text-center bg-muted/60 border-r">
                    {month}
                  </TableHead>
                ))}
              <TableHead className="text-center bg-muted/60 border-r">Cost</TableHead>
              <TableHead className="text-center bg-muted/60 border-r">Income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                <TableRow>
                    <TableCell colSpan={20} className="h-24 text-center">
                        Loading planner data...
                    </TableCell>
                </TableRow>
             ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={20}>
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center print:hidden">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No arts plan items found</h3>
                    <p className="text-muted-foreground">
                      No items for {year}. Add items for this year.
                    </p>
                    <Button onClick={handleAddItem}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Item
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
                filteredItems.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="border-r">{index + 1}</TableCell>
                        <TableCell className="border-r">{item.task}</TableCell>
                        <TableCell className="border-r">{item.measure}</TableCell>
                        <TableCell className="border-r">{item.quantity}</TableCell>
                        <TableCell className="border-r">{item.collaborator}</TableCell>
                        {Object.values(quarters).flat().map(month => (
                            <TableCell key={month} className="text-center border-r">
                                {item.months[month] && <Checkbox checked={true} disabled />}
                            </TableCell>
                        ))}
                        <TableCell className="border-r">{item.budgetRequested}</TableCell>
                        <TableCell className="border-r">{item.approvedCost}</TableCell>
                        <TableCell className="border-r">{item.approvedIncome}</TableCell>
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
