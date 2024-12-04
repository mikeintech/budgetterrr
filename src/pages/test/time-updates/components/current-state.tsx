import { Card } from '@/components/ui/card';
import { UserData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface CurrentStateProps {
  data: UserData;
}

export function CurrentState({ data }: CurrentStateProps) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Current State</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Pay Schedule:</span>
          <span>{data.budget.paySchedule.frequency}</span>
        </div>
        <div className="flex justify-between">
          <span>Next Pay Date:</span>
          <span>{format(new Date(data.budget.paySchedule.nextPayDate), 'PPP')}</span>
        </div>
        <div className="flex justify-between">
          <span>Pay Amount:</span>
          <span>{formatCurrency(data.budget.paySchedule.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Cash:</span>
          <span>{formatCurrency(data.budget.currentCash)}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Savings:</span>
          <span>{formatCurrency(data.savingsGoal.currentAmount)}</span>
        </div>
      </div>
    </Card>
  );
}