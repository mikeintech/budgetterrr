import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';
import { subYears, format } from 'date-fns';

export function YearlyComparison() {
  const { data } = useData();
  
  // Generate yearly comparison data
  const yearlyData = Array.from({ length: 3 }, (_, i) => {
    const date = subYears(new Date(), i);
    const yearExpenses = Object.values(data.budget.expenses).reduce((sum, amount) => sum + amount, 0);
    const yearSavings = data.budget.targetSavings * 12;
    
    return {
      year: format(date, 'yyyy'),
      expenses: yearExpenses,
      savings: yearSavings,
    };
  }).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Bar dataKey="expenses" fill="hsl(var(--chart-1))" name="Expenses" />
              <Bar dataKey="savings" fill="hsl(var(--chart-2))" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}