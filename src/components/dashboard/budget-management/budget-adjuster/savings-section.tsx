import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

interface SavingsSectionProps {
  data: {
    savingsGoal: string;
    savingsTimeline: string;
    targetSavings: string;
  };
  onChange: (field: string, value: string) => void;
}

export function SavingsSection({ data, onChange }: SavingsSectionProps) {
  const requiredMonthlySavings = Number(data.savingsGoal) > 0 && Number(data.savingsTimeline) > 0
    ? Number(data.savingsGoal) / Number(data.savingsTimeline)
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="savingsGoal">Overall Savings Goal</Label>
        <Input
          id="savingsGoal"
          type="number"
          value={data.savingsGoal}
          onChange={(e) => onChange('savingsGoal', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="savingsTimeline">Timeline (months)</Label>
        <Select 
          value={data.savingsTimeline} 
          onValueChange={(value) => onChange('savingsTimeline', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months</SelectItem>
            <SelectItem value="6">6 months</SelectItem>
            <SelectItem value="12">1 year</SelectItem>
            <SelectItem value="24">2 years</SelectItem>
            <SelectItem value="36">3 years</SelectItem>
          </SelectContent>
        </Select>
        {requiredMonthlySavings > 0 && (
          <p className="text-sm text-muted-foreground">
            Required monthly savings: {formatCurrency(requiredMonthlySavings)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetSavings">Monthly Savings Target</Label>
        <Input
          id="targetSavings"
          type="number"
          value={data.targetSavings}
          onChange={(e) => onChange('targetSavings', e.target.value)}
        />
        {Number(data.targetSavings) < requiredMonthlySavings && requiredMonthlySavings > 0 && (
          <p className="text-sm text-red-500">
            Target is below required monthly savings
          </p>
        )}
      </div>
    </div>
  );
}