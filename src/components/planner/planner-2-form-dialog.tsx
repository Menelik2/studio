
'use client';

import { useEffect, useState } from 'react';
import type { Planner2Item } from '@/lib/definitions';
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
import { Save } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { usePlanner2DialogStore } from '@/hooks/use-planner-2-dialog-store';


const getInitialFormState = (): Omit<Planner2Item, 'id'> => ({
    activity: '',
    measure: '',
    annualPlan: '',
    approvedBudget: '',
    performance: '',
    executionPercentage: '',
    year: new Date().getFullYear().toString(),
});


export function Planner2FormDialog() {
  const { isOpen, item, onClose, onSubmit } = usePlanner2DialogStore();
  const [formState, setFormState] = useState<Planner2Item | Omit<Planner2Item, 'id'>>(getInitialFormState());

  const isEdit = !!item;

  useEffect(() => {
    if (isOpen) {
      setFormState(item || getInitialFormState());
    }
  }, [item, isOpen]);

  const handleFieldChange = (field: keyof Omit<Planner2Item, 'id'>, value: string) => {
    setFormState(prev => ({...prev, [field]: value}));
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(onSubmit) {
        onSubmit(formState as Planner2Item);
    }
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEdit ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of this item.' : 'Fill in the details for the new item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="activity">የተከናወነው ተግባር ዝርዝር (List of activities performed)</Label>
                <Textarea id="activity" value={formState.activity} onChange={(e) => handleFieldChange('activity', e.target.value)} placeholder="Enter activity details" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="measure">መለኪያ (Measure)</Label>
                    <Input id="measure" value={formState.measure} onChange={(e) => handleFieldChange('measure', e.target.value)} placeholder="Enter measure" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="annualPlan">የዓመቱ እቅድ (Annual Plan)</Label>
                    <Input id="annualPlan" value={formState.annualPlan} onChange={(e) => handleFieldChange('annualPlan', e.target.value)} placeholder="Enter annual plan" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="approvedBudget">የፀደቀ በጀት (Approved Budget)</Label>
                    <Input id="approvedBudget" value={formState.approvedBudget} onChange={(e) => handleFieldChange('approvedBudget', e.target.value)} placeholder="Enter approved budget" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="performance">ክንውን (Performance)</Label>
                    <Input id="performance" value={formState.performance} onChange={(e) => handleFieldChange('performance', e.target.value)} placeholder="Enter performance" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="executionPercentage">አፈፃፀም በ% (Execution in %)</Label>
                    <Input id="executionPercentage" value={formState.executionPercentage} onChange={(e) => handleFieldChange('executionPercentage', e.target.value)} placeholder="Enter execution %" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" value={formState.year} onChange={(e) => handleFieldChange('year', e.target.value)} />
                </div>
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
