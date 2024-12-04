import { Card } from '@/components/ui/card';
import { SimulationState } from '@/lib/simulation/types';
import { formatCurrency } from '@/lib/utils';
import { addMonths, format } from 'date-fns';
import { calculateTimeToGoal, calculateProjectedSavings } from '@/lib/simulation/calculations';

interface SimulationMetricsProps {
  simulationState: SimulationState;
}

export function SimulationMetrics({ simulationState }: SimulationMetricsProps) {
  const { budget, savingsGoal } = simulationState;
  const monthlyIncome = budget.income;
  const monthlySavings = budget.targetSavings;
  const monthlyExpenses = Object.values(budget.expenses)
    .reduce((sum, amount) => sum + amount, 0);

  // Calculate metrics
  const savingsRate = (monthlySavings / monthlyIncome) * 100;
  const monthsToGoal = calculateTimeToGoal(simulationState);
  const projectedDate = addMonths(new Date(), monthsToGoal);
  const yearlyProjection = calculateProjectedSavings(simulationState);

  // Calculate scenario impact
  const scenarioImpact = simulationState.activeScenarios.reduce((total, scenarioId) => {
    const scenario = simulationState.scenarios.find(s => s.id === scenarioId);
    return total + (scenario?.impact || 0);
  }, 0);

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Financial Metrics</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-2xl font-semibold">{savingsRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">of monthly income</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Savings</p>
            <p className="text-2xl font-semibold">{formatCurrency(monthlySavings)}</p>
            <p className="text-xs text-muted-foreground">current target</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Goal Amount</span>
            <span className="font-medium">{formatCurrency(savingsGoal.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Current Progress</span>
            <span className="font-medium">
              {formatCurrency(savingsGoal.currentAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Yearly Projection</span>
            <span className="font-medium text-green-500">
              {formatCurrency(yearlyProjection)}
            </span>
          </div>
          {scenarioImpact > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Scenario Impact</span>
              <span className="font-medium text-green-500">
                +{formatCurrency(scenarioImpact)}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-1">Projected Goal Completion</p>
          <p className="text-lg font-medium">{format(projectedDate, 'MMMM yyyy')}</p>
          <p className="text-xs text-muted-foreground">
            {monthsToGoal.toFixed(1)} months at current rate
          </p>
        </div>
      </div>
    </Card>
  );
}