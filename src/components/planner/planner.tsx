
'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { Check, Edit, FileText, PlusCircle, Search, Trash2, Printer, Save } from 'lucide-react';
import type { PlannerItem } from '@/lib/definitions';
import { PlannerFormDialog, usePlannerDialog } from './planner-form-dialog';
import { getPlanner1ItemsAction, savePlanner1ItemsAction, getPlannerSignaturesAction, savePlannerSignaturesAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const quarters = {
  '1ኛ ሩብ ዓመት': ['ሐምሌ', 'ነሐሴ', 'መስከረም'],
  '2ኛ ሩብ ዓመት': ['ጥቅምት', 'ህዳር', 'ታህሳс'],
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
  
  const [preparationOfficer, setPreparationOfficer] = useState('');
  const [reviewOfficer, setReviewOfficer] = useState('');

  const loadSignatures = useCallback(async (currentYear: number) => {
    try {
        const signatures = await getPlannerSignaturesAction(currentYear);
        if (signatures) {
            setPreparationOfficer(signatures.preparationOfficer);
            setReviewOfficer(signatures.reviewOfficer);
        } else {
            setPreparationOfficer('');
            setReviewOfficer('');
        }
    } catch (error) {
        toast({
            title: 'Error loading signatures',
            description: 'Could not fetch signature data.',
            variant: 'destructive',
        });
    }
  }, [toast]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedItems = await getPlanner1ItemsAction();
        setItems(loadedItems);
        await loadSignatures(year);
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
    loadData();
  }, [toast, year, loadSignatures]);

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

  const handleSaveSignatures = async () => {
    const result = await savePlannerSignaturesAction({
        year,
        preparationOfficer,
        reviewOfficer
    });
    if(result.success) {
        toast({
            title: 'Signatures Saved',
            description: 'The officer names have been saved for this year.',
        });
    } else {
        toast({
            title: 'Error Saving Signatures',
            description: 'Could not save the officer names.',
            variant: 'destructive',
        });
    }
  }


  const handleAddItem = () => {
    onOpen(null, (newItem) => {
        const updatedItems = [...items, {...newItem, id: (items.length + 1).toString(), year: year.toString()}];
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

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    if (!isNaN(newYear)) {
      setYear(newYear);
    }
  }

  const filteredItems = items
    .filter(item => item.year === year.toString())
    .filter(item => item.task.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4 print:space-y-2 print-container">
      <PlannerFormDialog />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
        <div>
            <h1 className="font-headline text-xl font-bold tracking-tight">የባሕር ዳር ፈ/ገ/ቅ/ጊዮርጊስ ካቴድራል ሰንበት ት/ቤት</h1>
            <p className="text-muted-foreground">የ{year} ዓ.ም የኪነጥበብ ክፍል የሥራ ዕቅድ</p>
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
                onChange={handleYearChange}
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
              <TableHead rowSpan={2} className="border-r align-middle">ተ.ቁ</TableHead>
              <TableHead rowSpan={2} className="border-r align-middle">ዝርዝር ተግባር</TableHead>
              <TableHead rowSpan={2} className="border-r align-middle">መለኪያ</TableHead>
              <TableHead rowSpan={2} className="border-r align-middle">ብዛት</TableHead>
              <TableHead rowSpan={2} className="border-r align-middle">ከማን ጋር እንሰራለን?</TableHead>
              <TableHead colSpan={3} className="text-center border-r">1ኛ ሩብ ዓመት</TableHead>
              <TableHead colSpan={3} className="text-center border-r">2ኛ ሩብ ዓመት</TableHead>
              <TableHead colSpan={3} className="text-center border-r">3ኛ ሩብ ዓመት</TableHead>
              <TableHead colSpan={3} className="text-center border-r">4ኛ ሩብ ዓመት</TableHead>
              <TableHead colSpan={2} className="text-center border-r">የተጠየቀው በጀት</TableHead>
              <TableHead rowSpan={2} className="border-r align-middle">የጸደቀ ወጪ</TableHead>
              <TableHead rowSpan={2} className="border-r align-middle print:hidden">ድርጊቶች</TableHead>
            </TableRow>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              {Object.values(quarters).flat().map(month => (
                <TableHead key={month} className="text-center border-r text-xs" style={{ backgroundColor: '#F2DC7E' }}>{month}</TableHead>
              ))}
              <TableHead className="text-center border-r text-xs">ወጪ</TableHead>
              <TableHead className="text-center border-r text-xs">ገቢ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                <TableRow>
                    <TableCell colSpan={20} className="h-24 text-center">
                        የእቅድ መረጃ በመጫን ላይ...
                    </TableCell>
                </TableRow>
             ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={20}>
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
                        {Object.values(quarters).flat().map(month => (
                          <TableCell key={`${item.id}-${month}`} className="text-center border-r">
                            {item.months[month] && <Check className="h-4 w-4 mx-auto" />}
                          </TableCell>
                        ))}
                        <TableCell className="border-r">{item.budgetRequested}</TableCell>
                        <TableCell className="border-r">{item.approvedIncome}</TableCell>
                        <TableCell className="border-r">{item.approvedCost}</TableCell>
                        <TableCell className="text-right print:hidden">
                           <div className="flex justify-end gap-2">
                             <Button variant="outline" size="icon" onClick={() => handleEditItem(item)}>
                                <Edit className="h-4 w-4" />
                             </Button>
                             <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                           </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 print:hidden">
        <div className="space-y-2">
            <h4 className="font-semibold">የዝግጅት ኃላፊ ስም፡</h4>
            <Input placeholder="ስም ያስገቡ" value={preparationOfficer} onChange={(e) => setPreparationOfficer(e.target.value)} />
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold">የእይታ ኃላፊ ስም፡</h4>
            <Input placeholder="ስም ያስገቡ" value={reviewOfficer} onChange={(e) => setReviewOfficer(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end print:hidden">
          <Button onClick={handleSaveSignatures}><Save className="mr-2 h-4 w-4" /> Save Signatures</Button>
      </div>
      
       <div className="hidden print:grid grid-cols-2 gap-16 pt-16">
        <div>
            <p className="font-semibold">የዝግጅት ኃላፊ ስም፡- {preparationOfficer}</p>
            <p className="mt-4">ፊርማ፡ __________________</p>
        </div>
        <div>
            <p className="font-semibold">የእይታ ኃላፊ ስም፡- {reviewOfficer}</p>
            <p className="mt-4">ፊርማ፡ __________________</p>
        </div>
      </div>
    </div>
  );
}
