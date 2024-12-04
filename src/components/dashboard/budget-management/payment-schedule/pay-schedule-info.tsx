import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { Card } from '@/components/ui/card';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { PaySchedule } from '@/lib/types';

function getNextPayDates(paySchedule: PaySchedule): Date[] {
  const nextPayDate = new Date(paySchedule.nextPayDate);
  const dates: Date[] = [nextPayDate];

  switch (paySchedule.frequency) {
    case 'weekly':
      dates.push(addWeeks(nextPayDate, 1));
      dates.push(addWeeks(nextPayDate, 2));
      dates.push(addWeeks(nextPayDate, 3));
      break;
    case 'biweekly':
      dates.push(addWeeks(nextPayDate, 2));
      dates.push(addWeeks(nextPayDate, 4));
      break;
    case 'semi_monthly':
      const secondDate = new Date(nextPayDate);
      secondDate.setDate(paySchedule.secondPayDay || 30);
      if (secondDate > nextPayDate) {
        dates.push(secondDate);
      } else {
        dates.push(addMonths(secondDate, 1));
      }
      const thirdDate = addMonths(nextPayDate, 1);
      dates.push(thirdDate);
      break;
    case 'monthly':
      dates.push(addMonths(nextPayDate, 1));
      dates.push(addMonths(nextPayDate, 2));
      break;
  }

  return dates;
}

function getFrequencyLabel(frequency: PaySchedule['frequency']): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Every Two Weeks';
    case 'semi_monthly':
      return 'Twice Monthly';
    case 'monthly':
      return 'Monthly';
    default:
      return '';
  }
}

export function PayScheduleInfo() {
  const { data } = useData();
  const { paySchedule } = data.budget;
  const nextPayDates = getNextPayDates(paySchedule);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-medium">Pay Schedule</h3>
            <p className="text-sm text-muted-foreground">
              {getFrequencyLabel(paySchedule.frequency)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(paySchedule.amount)}</p>
            <p className="text-sm text-muted-foreground">per paycheck</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Upcoming Payments</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {nextPayDates.map((date, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{format(date, 'MMM d, yyyy')}</span>
                <span>{formatCurrency(paySchedule.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Future Income</span>
            <span className="font-medium">{formatCurrency(data.budget.income)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}