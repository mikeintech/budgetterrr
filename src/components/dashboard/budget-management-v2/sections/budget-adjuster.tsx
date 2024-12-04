import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '@/lib/data-context';
import { formatCurrency } from '@/lib/utils';

export function BudgetAdjuster() {
  const { data, updateData } = useData();
  const { budget } = data;

  const handleCategoryChange = (category: string, value: number) => {
    updateData({
      budget: {
        ...budget,
        expenses: {
          ...budget.expenses,
          [category]: value,
        },
      },
    });
  };

  const handleSavingsChange = (value: number) => {
    updateData({
      budget: {
        ...budget,
        targetSavings: value,
      },
    });
  };

  const handlePresetClick = (preset: 'save-more' | 'spend-less' | 'balanced') => {
    const currentExpenses = Object.values(budget.expenses).reduce((sum, amount) => sum + amount, 0);
    
    switch (preset) {
      case 'save-more':
        handleSavingsChange(budget.targetSavings * 1.1); // Increase savings by 10%
        break;
      case 'spend-less':
        // Reduce non-essential expenses by 15%
        const updatedExpenses = { ...budget.expenses };
        ['entertainment', 'food'].forEach(category => {
          updatedExpenses[category] = budget.expenses[category] * 0.85;
        });
        updateData({
          budget: {
            ...budget,
            expenses: updatedExpenses,
          },
        });
        break;
      case 'balanced':
        // Distribute budget proportionally
        const totalBudget = budget.income;
        const savingsRatio = 0.2; // 20% for savings
        const expensesRatio = 0.8; // 80% for expenses
        
        handleSavingsChange(totalBudget * savingsRatio);
        
        const categories = Object.keys(budget.expenses);
        const perCategory = (totalBudget * expensesRatio) / categories.length;
        const balancedExpenses = categories.reduce((acc, category) => {
          acc[category] = perCategory;
          return acc;
        }, {} as Record<string, number>);
        
        updateData({
          budget: {
            ...budget,
            expenses: balancedExpenses,
          },
        });
        break;
    }
  };

  // Prepare data for pie chart
  const chartData = [
    ...Object.entries(budget.expenses).map(([category, amount]) => ({
      name: category,
      value: amount,
    })),
    {
      name: 'Savings',
      value: budget.targetSavings,
    },
  ];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Budget Allocation</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePresetClick('save-more')}
            >
              Save More
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePresetClick('spend-less')}
            >
              Spend Less
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePresetClick('balanced')}
            >
              Balance
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-4">
              {Object.entries(budget.expenses).map(([category, amount], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <Label className="capitalize">{category}</Label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <Slider
                    value={[amount]}
                    max={budget.income}
                    step={100}
                    onValueChange={([value]) => handleCategoryChange(category, value)}
                    className="[&>span]:bg-gradient-to-r [&>span]:from-green-500 [&>span]:to-red-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {((amount / budget.income) * 100).toFixed(1)}% of income
                  </p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <div className="flex justify-between">
                  <Label>Monthly Savings</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(budget.targetSavings)}
                  </span>
                </div>
                <Slider
                  value={[budget.targetSavings]}
                  max={budget.income}
                  step={100}
                  onValueChange={([value]) => handleSavingsChange(value)}
                  className="[&>span]:bg-blue-500"
                />
                <p className="text-xs text-muted-foreground">
                  {((budget.targetSavings / budget.income) * 100).toFixed(1)}% of income
                </p>
              </motion.div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-200 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => label}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}