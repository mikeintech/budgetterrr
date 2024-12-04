import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudget } from '@/lib/budget-context';
import { formatCurrency } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export function PayCycleSummary() {
  const { localBudget } = useBudget();
  const { paySchedule, targetSavings, currentCash } = localBudget;

  // Calculate savings progress
  const progress = (currentCash / targetSavings) * 100;
  
  // Generate projected cash flow data
  const cashFlowData = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(new Date(), i);
    const projectedSavings = currentCash + (targetSavings * (i + 1));
    const projectedCash = currentCash + 
      ((paySchedule.amount - 
        (Object.values(localBudget.expenses).reduce((sum, amount) => sum + amount, 0) / 4.33) - 
        (targetSavings / 4.33)) * (i + 1) * 4.33);

    return {
      month: format(date, 'MMM'),
      savings: projectedSavings,
      cash: projectedCash,
    };
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-medium">Income & Pay Schedule</h3>
          <div className="grid gap-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Per Paycheck</span>
              <span className="text-2xl font-bold">{formatCurrency(paySchedule.amount)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Monthly Income</span>
              <span className="text-lg font-semibold">{formatCurrency(localBudget.income)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Next Pay Date</span>
              <span className="text-lg">{format(new Date(paySchedule.nextPayDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="font-medium">Projected Cash Flow</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  name="Savings"
                />
                <Area
                  type="monotone"
                  dataKey="cash"
                  stackId="2"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.1}
                  name="Cash"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}