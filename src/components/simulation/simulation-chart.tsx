import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { SimulationState } from '@/lib/simulation/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { addMonths, format } from 'date-fns';

interface SimulationChartProps {
  simulationState: SimulationState;
}

export function SimulationChart({ simulationState }: SimulationChartProps) {
  const { budget, savingsGoal } = simulationState;
  const monthlyIncome = budget.income;
  const monthlySavings = budget.targetSavings;
  const monthlyExpenses = Object.values(budget.expenses)
    .reduce((sum, amount) => sum + amount, 0);

  // Generate 24 months of projected data
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const date = addMonths(new Date(), i);
    const savings = monthlySavings * (i + 1);
    const baseProjection = monthlySavings * 1.05 * (i + 1); // 5% growth assumption
    
    // Apply scenario effects
    const scenarioMultiplier = simulationState.activeScenarios.length * 0.1;
    const projectedWithScenarios = baseProjection * (1 + scenarioMultiplier);

    return {
      month: format(date, 'MMM yyyy'),
      actual: savings,
      projected: projectedWithScenarios,
    };
  });

  return (
    <Card className="p-4">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Current Path"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={false}
              name="Optimized Path"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}