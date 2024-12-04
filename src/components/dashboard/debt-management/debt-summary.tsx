import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { calculateMinimumPaymentTotal } from '@/lib/calculations/debt';

export function DebtSummary() {
  const { data } = useData();
  const debts = data.debts || [];

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const minimumPaymentsTotal = calculateMinimumPaymentTotal(debts);
  const monthlyIncome = data.budget.income;
  const debtToIncomeRatio = monthlyIncome ? (minimumPaymentsTotal / monthlyIncome) * 100 : 0;

  const debtByType = debts.reduce((acc, debt) => {
    acc[debt.type] = (acc[debt.type] || 0) + debt.balance;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Total Debt</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalDebt)}</p>
          <p className="text-sm text-muted-foreground">
            Minimum Monthly Payments: {formatCurrency(minimumPaymentsTotal)}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Debt-to-Income Ratio</h4>
          <Progress value={debtToIncomeRatio} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {debtToIncomeRatio.toFixed(1)}% of monthly income
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Debt Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(debtByType).map(([type, amount]) => (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <Progress
                  value={(amount / totalDebt) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}