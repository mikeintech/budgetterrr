import { formatCurrency } from '@/lib/utils';

interface BudgetSummaryProps {
  totalAllocation: number;
  totalIncome: number;
  remainingBudget: number;
}

export function BudgetSummary({ 
  totalAllocation, 
  totalIncome, 
  remainingBudget 
}: BudgetSummaryProps) {
  return (
    <div className="pt-4 border-t space-y-2">
      <div className="flex justify-between text-sm">
        <span>Total Allocation:</span>
        <span className={totalAllocation > totalIncome ? 'text-red-500' : ''}>
          {formatCurrency(totalAllocation)} ({((totalAllocation / totalIncome) * 100).toFixed(1)}%)
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Remaining Budget:</span>
        <span className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
          {formatCurrency(remainingBudget)}
        </span>
      </div>
    </div>
  );
}