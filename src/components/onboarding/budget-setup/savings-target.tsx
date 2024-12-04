import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/lib/data-context';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

export function SavingsTarget() {
  const { data, updateData } = useData();
  const [savingsGoal, setSavingsGoal] = useState({
    amount: data.savingsGoal.amount.toString(),
    timeline: data.savingsGoal.timeline.toString(),
    targetSavings: data.budget.targetSavings.toString(),
  });

  // Calculate required monthly savings
  const requiredMonthlySavings = Number(savingsGoal.amount) > 0 && Number(savingsGoal.timeline) > 0
    ? Number(savingsGoal.amount) / Number(savingsGoal.timeline)
    : 0;

  const handleChange = (field: string, value: string) => {
    setSavingsGoal(prev => ({ ...prev, [field]: value }));

    if (field === 'amount' || field === 'timeline') {
      updateData({
        savingsGoal: {
          ...data.savingsGoal,
          [field]: Number(value) || 0,
        },
      });
    } else if (field === 'targetSavings') {
      updateData({
        budget: {
          ...data.budget,
          targetSavings: Number(value) || 0,
        },
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Savings Goals</h3>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Overall Savings Goal</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter your savings goal"
              value={savingsGoal.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Select 
              value={savingsGoal.timeline}
              onValueChange={(value) => handleChange('timeline', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">1 year</SelectItem>
                <SelectItem value="24">2 years</SelectItem>
                <SelectItem value="36">3 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {requiredMonthlySavings > 0 && (
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Required monthly savings to reach goal:
            </p>
            <p className="text-xl font-bold">
              {formatCurrency(requiredMonthlySavings)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="targetSavings">Monthly Savings Target</Label>
          <Input
            id="targetSavings"
            type="number"
            placeholder="Enter your monthly savings target"
            value={savingsGoal.targetSavings}
            onChange={(e) => handleChange('targetSavings', e.target.value)}
          />
          {Number(savingsGoal.targetSavings) < requiredMonthlySavings && requiredMonthlySavings > 0 && (
            <p className="text-sm text-red-500">
              Target is below required monthly savings
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}