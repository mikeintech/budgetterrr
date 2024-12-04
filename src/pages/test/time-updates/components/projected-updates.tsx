import { Card } from '@/components/ui/card';
import { UserData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { addDays, addWeeks, addMonths, format } from 'date-fns';

interface ProjectedUpdatesProps {
  data: UserData;
}

export function ProjectedUpdates({ data }: ProjectedUpdatesProps) {
  const calculateNextPayDate = () => {
    const currentDate = new Date(data.budget.paySchedule.nextPayDate);
    
    switch (data.budget.paySchedule.frequency) {
      case 'weekly':
        return addWeeks(currentDate, 1);
      case 'biweekly':
        return addWeeks(currentDate, 2);
      case 'semi_monthly':
        return addDays(currentDate, 15);
      case 'monthly':
      default:
        return addMonths(currentDate, 1);
    }
  };

  const monthlyExpenses = Object.values(data.budget.expenses).reduce((sum, amount) => sum + amount, 0) +
    (data.budget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0);

  const nextPayDate = calculateNextPayDate();

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Projected Next Update</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Next Pay Date:</span>
          <span>{format(nextPayDate, 'PPP')}</span>
        </div>
        <div className="flex justify-between">
          <span>Monthly Expenses:</span>
          <span>{formatCurrency(monthlyExpenses)}</span>
        </div>
        <div className="flex justify-between">
          <span>Monthly Savings Target:</span>
          <span>{formatCurrency(data.budget.targetSavings)}</span>
        </div>
      </div>
    </Card>
  );
}