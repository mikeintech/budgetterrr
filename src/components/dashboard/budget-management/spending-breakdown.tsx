import { Progress } from '@/components/ui/progress';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';

export function SpendingBreakdown() {
  const { data } = useData();
  
  // Combine base expenses and custom expenses
  const baseExpenses = Object.entries(data.budget.expenses).map(([category, amount]) => ({
    category,
    amount,
  }));

  const customExpenses = data.budget.customExpenses?.map(exp => ({
    category: exp.name,
    amount: exp.amount,
  })) || [];

  const allExpenses = [...baseExpenses, ...customExpenses];
  const totalExpenses = allExpenses.reduce((sum, { amount }) => sum + amount, 0);

  const categories = allExpenses
    .filter(({ amount }) => amount > 0) // Only show categories with expenses
    .map(({ category, amount }) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount); // Sort by amount descending

  const colors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4',
    'bg-chart-5',
  ];

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Spending Breakdown</h3>
        <p className="text-sm text-muted-foreground">No expenses configured yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Spending Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Total: {formatCurrency(totalExpenses)}
        </p>
      </div>
      <div className="space-y-3">
        {categories.map(({ category, amount, percentage }, index) => (
          <div key={category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                <span className="capitalize">{category}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{formatCurrency(amount)}</span>
                <span className="text-xs">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${colors[index % colors.length]}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
