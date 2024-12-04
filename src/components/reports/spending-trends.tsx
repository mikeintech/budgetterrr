import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { subMonths, format } from 'date-fns';

export function SpendingTrends() {
  const { data } = useData();
  
  // Generate last 12 months of spending data
  const spendingData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthExpenses = Object.values(data.budget.expenses).reduce((sum, amount) => sum + amount, 0);
    const customExpenses = data.budget.customExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    
    return {
      month: format(date, 'MMM'),
      amount: monthExpenses + customExpenses,
    };
  }).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}