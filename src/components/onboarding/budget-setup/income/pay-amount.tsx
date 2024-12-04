import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PaySchedule } from '@/lib/types';
import { calculateMonthlyIncome } from './utils';

interface PayAmountProps {
  amount: number;
  frequency: PaySchedule['frequency'];
  onAmountChange: (amount: string) => void;
}

export function PayAmount({ amount, frequency, onAmountChange }: PayAmountProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="payAmount">
        {frequency === 'monthly' ? 'Monthly' : 'Per Paycheck'} Amount
      </Label>
      <Input
        id="payAmount"
        type="number"
        placeholder="Enter amount"
        value={amount || ''}
        onChange={(e) => onAmountChange(e.target.value)}
      />
      {frequency !== 'monthly' && (
        <p className="text-sm text-muted-foreground">
          Monthly Income: ${calculateMonthlyIncome(frequency, amount).toFixed(2)}
        </p>
      )}
    </div>
  );
}