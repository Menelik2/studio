
'use client';

import { useEffect, useState } from 'react';
import type { PlannerItem } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '../ui/checkbox';
import { Save } from 'lucide-react';
import { usePlannerDialogStore } from '@/hooks/use-planner-dialog-store';

const quarters = {
    '1ኛ ሩብ ዓመት': ['ሐምሌ', 'ነሐሴ', 'መስከረም'],
    '2ኛ ሩብ ዓመት': ['ጥቅምት', 'ህዳр', 'ታህሳс'],
    '3ኛ ሩብ ዓመት': ['ጥር', 'የካቲት', 'መጋቢት'],
    '4ኛ ሩብ ዓመት': ['ሚያዝያ', 'ግንቦት', 'ሰኔ'],
};

const getInitialFormState = (): PlannerItem => ({
    id: '',
    task: '',
    measure: '',
    quantity: '',
    collaborator: '',
    budgetRequested: '',
    approvedCost: '',
    approvedIncome: '',
    year: new Date().getFullYear().toString(),
    months: Object.values(quarters).flat().reduce((acc, month) => ({...acc, [month]: false}), {})
});


export function PlannerFormDialog() {
  const { isOpen, item, onClose, onSubmit } = usePlannerDialogStore();
  const [formState, setFormState] = useState<PlannerItem>(getInitialFormState());

  const isEdit = !!item;

  useEffect(() => {
    if (isOpen) {
      setFormState(item || getInitialFormState());
    }
  }, [item, isOpen]);

  const handleFieldChange = (field: keyof Omit<PlannerItem, 'id' | 'months'>, value: string) => {
    setFormState(prev => ({...prev, [field]: value}));
  }

  const handleMonthChange = (month: string, checked: boolean) => {
    setFormState(prev => ({...prev, months: {...prev.months, [month]: checked}}));
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(onSubmit) {
        onSubmit(formState);
    }
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEdit ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of this item.' : 'Fill in the details for the new item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="task">ዝርዝር ተግባር</Label>
                    <Input id="task" value={formState.task} onChange={(e) => handleFieldChange('task', e.target.value)} placeholder="Enter detailed task" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="measure">መለኪያ</Label>
                    <Input id="measure" value={formState.measure} onChange={(e) => handleFieldChange('measure', e.target.value)} placeholder="Enter measure" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity">ብዛት</Label>
                    <Input id="quantity" value={formState.quantity} onChange={(e) => handleFieldChange('quantity', e.target.value)} placeholder="Enter quantity" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="collaborator">ከማን ጋር እንሰራለን?</Label>
                    <Input id="collaborator" value={formState.collaborator} onChange={(e) => handleFieldChange('collaborator', e.target.value)} placeholder="Enter collaboration partners" />
                </div>
            </div>

            <div>
                <Label>Select months for each quarter:</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
                    {Object.entries(quarters).map(([quarter, months]) => (
                        <div key={quarter}>
                            <h4 className="font-medium mb-2">{quarter}</h4>
                            <div className="space-y-2">
                                {months.map(month => (
                                    <div key={month} className="flex items-center gap-2">
                                        <Checkbox id={`${month}-check`} checked={formState.months[month]} onCheckedChange={(checked) => handleMonthChange(month, !!checked)} />
                                        <Label htmlFor={`${month}-check`}>{month}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="budgetRequested">Budget Requested by Department</Label>
                    <Input id="budgetRequested" value={formState.budgetRequested} onChange={(e) => handleFieldChange('budgetRequested', e.target.value)} placeholder="Enter budget requested" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="approvedCost">Approved Budget (Cost)</Label>
                    <Input id="approvedCost" value={formState.approvedCost} onChange={(e) => handleFieldChange('approvedCost', e.target.value)} placeholder="Enter approved cost" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="approvedIncome">Approved Budget (Income)</Label>
                    <Input id="approvedIncome" value={formState.approvedIncome} onChange={(e) => handleFieldChange('approvedIncome', e.target.value)} placeholder="Enter approved income" />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" value={formState.year} onChange={(e) => handleFieldChange('year', e.target.value)} />
                <p className="text-xs text-muted-foreground">You can type any year here. If you leave it empty, the current year will be used.</p>
            </div>


          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">
                {isEdit ? 'Save Changes' : 'Add'}
                <Save className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
