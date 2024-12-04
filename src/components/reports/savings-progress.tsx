import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { subMonths, format } from 'date-fns';

export function SavingsProgress() {
  const { data } = useData();
  
  // Generate savings progress data
  const savingsData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthlySavings = data.budget.targetSavings;
    const projectedAmount = monthlySavings * (12 - i);
    
    return {
      month: format(date, 'MMM'),
      actual: monthlySavings,
      projected: projectedAmount,
    };
  }).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stackId="2"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}