'use client';

import { useState } from 'react';
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
import { FileText, PlusCircle, Search } from 'lucide-react';

const quarters = {
  '1st quarter': ['July', 'August', 'September'],
  '2nd quarter': ['October', 'November', 'December'],
  '3rd quarter': ['January', 'February', 'March'],
  '4th quarter': ['April', 'May', 'June'],
};

export function Planner() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [items, setItems] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            <div className="absolute left-3 top-10 text-xs text-muted-foreground">
              <p>Type a year to filter and press</p>
              <p>Enter or click away to apply.</p>
            </div>
          </div>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          አዲስ ዝግጅት ጨምር
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-max whitespace-nowrap">
          <TableHeader>
            <TableRow className="bg-muted/50">
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
              <TableHead rowSpan={2}>Actions</TableHead>
            </TableRow>
            <TableRow className="bg-muted/50">
              {Object.values(quarters)
                .flat()
                .map((month) => (
                  <TableHead key={month} className="text-center bg-accent/20 border-r">
                    {month}
                  </TableHead>
                ))}
              <TableHead className="text-center bg-accent/20 border-r">Cost</TableHead>
              <TableHead className="text-center bg-accent/20 border-r">Income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={20}>
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No arts plan items found</h3>
                    <p className="text-muted-foreground">
                      No items for {year}. Add items for this year.
                    </p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Item
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
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
