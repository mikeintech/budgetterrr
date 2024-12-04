import { Card } from '@/components/ui/card';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';

export function CashSummary() {
  const { data } = useData();
  const { paySchedule } = data.budget;

  // Calculate total expenses
  const baseExpenses = Object.values(data.budget.expenses).reduce((sum, amount) => sum + amount, 0);
  const customExpenses = data.budget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalExpenses = baseExpenses + customExpenses;

  // Calculate per-paycheck amounts
  const perPaycheckExpenses = (() => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return totalExpenses / 4.33;
      case 'biweekly':
        return totalExpenses / 2.17;
      case 'semi_monthly':
        return totalExpenses / 2;
      case 'monthly':
      default:
        return totalExpenses;
    }
  })();

  const perPaycheckSavings = (() => {
    switch (paySchedule.frequency) {
      case 'weekly':
        return data.budget.targetSavings / 4.33;
      case 'biweekly':
        return data.budget.targetSavings / 2.17;
      case 'semi_monthly':
        return data.budget.targetSavings / 2;
      case 'monthly':
      default:
        return data.budget.targetSavings;
    }
  })();

  const remainingAmount = paySchedule.amount - perPaycheckExpenses - perPaycheckSavings;
  const availableCash = data.budget.currentCash + remainingAmount;

  return (
    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
      <div className="flex items-center gap-8">
        <div>
          <span className="text-sm text-muted-foreground">Beginning Cash</span>
          <p className="text-lg font-semibold">{formatCurrency(data.budget.currentCash)}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Ending Cash Per Paycheck</span>
          <p className={`text-lg font-semibold ${remainingAmount < 0 ? 'text-red-500' : 'text-green-500'}`}>
            <>{formatCurrency(remainingAmount)}</>
              {/* <span className="ml-2 text-xs text-muted-foreground">
                {paySchedule.frequency === 'weekly' ? '52x' : 
                  paySchedule.frequency === 'biweekly' ? '26x' : 
                  paySchedule.frequency === 'semi_monthly' ? '24x' : '12x'} per year
              </span> */}
          </p>
          
          
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Total Available Cash</span>
          <p className={`text-lg font-semibold ${availableCash < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatCurrency(availableCash)}
          </p>
        </div>
      </div>
      
    </div>
  );
}