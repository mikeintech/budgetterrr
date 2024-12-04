import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaySchedule } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CustomAllocation } from './custom-allocation';

type AllocationStrategy = 'evenly' | 'first_check' | 'last_check' | 'custom';

interface ExpenseAllocationProps {
  paySchedule: PaySchedule;
  totalExpenses: number;
  onAllocationChange: (strategy: AllocationStrategy, customAllocations?: number[]) => void;
}

export function ExpenseAllocation({ paySchedule, totalExpenses, onAllocationChange }: ExpenseAllocationProps) {
  const [strategy, setStrategy] = useState<AllocationStrategy>('evenly');
  const [customAllocations, setCustomAllocations] = useState<number[]>([]);

  const handleStrategyChange = (value: AllocationStrategy) => {
    setStrategy(value);
    if (value !== 'custom') {
      onAllocationChange(value);
    }
  };

  const handleCustomAllocationChange = (allocations: number[]) => {
    setCustomAllocations(allocations);
    onAllocationChange('custom', allocations);
  };

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
  const evenAmount = totalExpenses / paycheckCount;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label>How would you like to allocate expenses?</Label>
          <Select value={strategy} onValueChange={(value) => handleStrategyChange(value as AllocationStrategy)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="evenly">Split evenly across paychecks</SelectItem>
              <SelectItem value="first_check">Pay from first check</SelectItem>
              <SelectItem value="last_check">Pay from last check</SelectItem>
              <SelectItem value="custom">Custom allocation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Allocation Preview:</p>
          {strategy === 'evenly' && (
            <div className="grid gap-2">
              {Array.from({ length: paycheckCount }).map((_, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>Paycheck {i + 1}</span>
                  <span>{formatCurrency(evenAmount)}</span>
                </div>
              ))}
            </div>
          )}

          {strategy === 'first_check' && (
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span>Paycheck 1</span>
                <span>{formatCurrency(totalExpenses)}</span>
              </div>
              {Array.from({ length: paycheckCount - 1 }).map((_, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>Paycheck {i + 2}</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              ))}
            </div>
          )}

          {strategy === 'last_check' && (
            <div className="grid gap-2">
              {Array.from({ length: paycheckCount - 1 }).map((_, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>Paycheck {i + 1}</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span>Paycheck {paycheckCount}</span>
                <span>{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          )}

          {strategy === 'custom' && (
            <CustomAllocation
              paySchedule={paySchedule}
              totalExpenses={totalExpenses}
              onAllocationChange={handleCustomAllocationChange}
            />
          )}
        </div>
      </div>
    </Card>
  );
}