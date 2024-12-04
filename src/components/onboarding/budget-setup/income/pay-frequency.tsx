import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaySchedule } from '@/lib/types';

interface PayFrequencyProps {
  frequency: PaySchedule['frequency'];
  onFrequencyChange: (frequency: PaySchedule['frequency']) => void;
}

export function PayFrequency({ frequency, onFrequencyChange }: PayFrequencyProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="payFrequency">How often do you get paid?</Label>
      <Select 
        value={frequency} 
        onValueChange={(value) => onFrequencyChange(value as PaySchedule['frequency'])}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="biweekly">Every Two Weeks</SelectItem>
          <SelectItem value="semi_monthly">Twice a Month (15th/30th)</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}