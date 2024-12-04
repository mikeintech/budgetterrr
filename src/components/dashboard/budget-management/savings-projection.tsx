import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { useData } from '@/lib/data-context';
import { calculatePeriodicPayment, generateSavingsGoals, getTimeframes } from '@/lib/calculations/projections';
import { Schedule, ProjectionRow, Timeframe } from '@/lib/types';

export function SavingsProjection() {
  const { data } = useData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [schedule, setSchedule] = useState<Schedule>('monthly');

  const timeframes = getTimeframes();
  const savingsGoals = generateSavingsGoals(data.savingsGoal.currentAmount, data.budget.income);

  const projections: ProjectionRow[] = savingsGoals.map(amount => ({
    amount,
    payments: {
      monthly: calculatePeriodicPayment(amount, selectedTimeframe, 'monthly'),
      'semi-monthly': calculatePeriodicPayment(amount, selectedTimeframe, 'semi-monthly'),
      biweekly: calculatePeriodicPayment(amount, selectedTimeframe, 'biweekly'),
      weekly: calculatePeriodicPayment(amount, selectedTimeframe, 'weekly'),
    }
  }));

  const getPaymentAmount = (row: ProjectionRow) => row.payments[schedule];
  const getCurrentSavingsRate = () => {
    const monthlyExpenses = Object.values(data.budget.expenses).reduce((sum, exp) => sum + exp, 0);
    return data.budget.income - monthlyExpenses;
  };
  const monthlyRate = getCurrentSavingsRate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Savings Projections</h3>
        <div className="flex gap-4">
          <Select value={selectedTimeframe.toString()} onValueChange={(value) => setSelectedTimeframe(Number(value))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf: Timeframe) => (
                <SelectItem key={tf.months} value={tf.months.toString()}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={schedule} onValueChange={(value) => setSchedule(value as Schedule)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="semi-monthly">Semi-monthly (15th/30th)</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-medium">
            Savings Goals ({timeframes.find(tf => tf.months === selectedTimeframe)?.label})
          </h4>
          <div className="text-sm text-muted-foreground">
            Current Rate: {formatCurrency(monthlyRate)}/month
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target Amount</TableHead>
              <TableHead className="text-right">Required {schedule} Payment</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((row) => {
              const payment = getPaymentAmount(row);
              const isAchievable = payment <= getCurrentSavingsRate();
              
              return (
                <TableRow key={row.amount}>
                  <TableCell className="font-medium">
                    {formatCurrency(row.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(payment)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={isAchievable ? 'text-green-500' : 'text-yellow-500'}>
                      {isAchievable ? 'Achievable' : 'Challenging'}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}