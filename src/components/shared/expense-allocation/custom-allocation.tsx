import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { PaySchedule } from '@/lib/types';

interface CustomAllocationProps {
  paySchedule: PaySchedule;
  totalExpenses: number;
  onAllocationChange: (allocations: number[]) => void;
}

export function CustomAllocation({ paySchedule, totalExpenses, onAllocationChange }: CustomAllocationProps) {
  const getPaycheckCount = () => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return 4;
      case 'biweekly':
        return 2;
      case 'semi_monthly':
        return 2;
      case 'monthly':
        return 1;
    }
  };

  const paycheckCount = getPaycheckCount();
  const [allocations, setAllocations] = useState<number[]>(
    Array(paycheckCount).fill(totalExpenses / paycheckCount)
  );

  const handleAllocationChange = (index: number, value: string) => {
    const newValue = Number(value) || 0;
    const newAllocations = [...allocations];
    newAllocations[index] = newValue;
    setAllocations(newAllocations);
    onAllocationChange(newAllocations);
  };

  const remaining = totalExpenses - allocations.reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {allocations.map((amount, index) => (
          <div key={index} className="flex items-center gap-4">
            <Label className="w-32">Paycheck {index + 1}</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => handleAllocationChange(index, e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">
              {((amount / totalExpenses) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span>Remaining to Allocate:</span>
          <span className={remaining === 0 ? 'text-green-500' : 'text-red-500'}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {remaining !== 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const evenAmount = totalExpenses / paycheckCount;
            const newAllocations = Array(paycheckCount).fill(evenAmount);
            setAllocations(newAllocations);
            onAllocationChange(newAllocations);
          }}
        >
          Reset to Even Split
        </Button>
      )}
    </div>
  );
}