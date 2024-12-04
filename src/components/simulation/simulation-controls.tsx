import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationState } from '@/lib/simulation/types';
import { formatCurrency } from '@/lib/utils';

interface SimulationControlsProps {
  simulationState: SimulationState;
  onStateChange: (newState: SimulationState) => void;
}

export function SimulationControls({ 
  simulationState,
  onStateChange 
}: SimulationControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { budget } = simulationState;
  const monthlyExpenses = Object.values(budget.expenses)
    .reduce((sum, amount) => sum + amount, 0);

  const handleSavingsRateChange = (value: number) => {
    onStateChange({
      ...simulationState,
      budget: {
        ...simulationState.budget,
        targetSavings: value,
      },
    });
  };

  const handleExpensesChange = (value: number) => {
    const ratio = value / monthlyExpenses;
    onStateChange({
      ...simulationState,
      budget: {
        ...simulationState.budget,
        expenses: Object.entries(budget.expenses).reduce((acc, [category, amount]) => {
          acc[category] = Math.round(amount * ratio);
          return acc;
        }, {} as Record<string, number>),
      },
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    onStateChange({
      ...simulationState,
      activeScenarios: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Simulation Controls</h3>
          <p className="text-sm text-muted-foreground">
            Adjust parameters to see how they affect your financial goals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="w-8 h-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Monthly Savings Rate</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[budget.targetSavings]}
                max={budget.income}
                step={100}
                onValueChange={([value]) => handleSavingsRateChange(value)}
              />
              <div className="w-24">
                <Input
                  type="number"
                  value={budget.targetSavings}
                  onChange={(e) => handleSavingsRateChange(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {((budget.targetSavings / budget.income) * 100).toFixed(1)}% of income
            </p>
          </div>

          <div className="space-y-2">
            <Label>Monthly Expenses</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[monthlyExpenses]}
                max={budget.income}
                step={100}
                onValueChange={([value]) => handleExpensesChange(value)}
              />
              <div className="w-24">
                <Input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => handleExpensesChange(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {((monthlyExpenses / budget.income) * 100).toFixed(1)}% of income
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg">
            <h4 className="font-medium mb-2">Monthly Cash Flow</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Income</span>
                <span>{formatCurrency(budget.income)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expenses</span>
                <span className="text-red-500">
                  -{formatCurrency(monthlyExpenses)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Savings</span>
                <span className="text-green-500">
                  -{formatCurrency(budget.targetSavings)}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Remaining</span>
                <span
                  className={
                    budget.income - monthlyExpenses - budget.targetSavings >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {formatCurrency(budget.income - monthlyExpenses - budget.targetSavings)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}