import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseAllocation } from '@/components/shared/expense-allocation';
import { useBudget } from '@/lib/budget-context';

export function ExpenseAllocationSection() {
  const { localBudget, updateLocalBudget } = useBudget();

  const totalExpenses = Object.values(localBudget.expenses).reduce((sum, amount) => sum + amount, 0) +
    (localBudget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0);

  const handleAllocationChange = (strategy: 'evenly' | 'first_check' | 'last_check' | 'custom', customAllocations?: number[]) => {
    updateLocalBudget({
      expenseAllocation: strategy,
      customAllocations: customAllocations,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ExpenseAllocation
          paySchedule={localBudget.paySchedule}
          totalExpenses={totalExpenses}
          onAllocationChange={handleAllocationChange}
        />
      </CardContent>
    </Card>
  );
}