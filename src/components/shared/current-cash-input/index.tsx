import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface CurrentCashInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function CurrentCashInput({ value, onChange }: CurrentCashInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="currentCash">Current Cash</Label>
      <Input
        id="currentCash"
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder="Enter your current cash amount"
      />
      {value > 0 && (
        <p className="text-sm text-muted-foreground">
          Available: {formatCurrency(value)}
        </p>
      )}
    </div>
  );
}